import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, ref, set } from "firebase/database";
import { Chat } from 'src/app/interfaces/chat';
import { EmailService } from './email.service';
import { FirebaseService } from './firebase.service';
import { doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  //https://firebase.google.com/docs/database/web/read-and-write?hl=es-419
  constructor(
    private auth:Auth,
    private mail: EmailService,
    private fire:FirebaseService
  ) { }

  private db = getDatabase();

  public UsuarioPrimero:any;
  public UsuarioSegundo:any;

  private SalaActual:any;
  private usuario:any;

  async chat(usuario1:any, usuario2:any) {
    this.UsuarioPrimero = usuario1;
    this.UsuarioSegundo = usuario2;

    await localStorage.setItem("Usuario1Chat",  JSON.stringify(usuario1))
    await localStorage.setItem("Usuario2Chat", JSON.stringify(usuario2))

    let sala = ref(this.db, 'Sala-' + this.UsuarioPrimero.uid + '-' + this.UsuarioSegundo.uid);

    let sala2 = ref(this.db, 'Sala-' + this.UsuarioSegundo.uid + '-' + this.UsuarioPrimero.uid);

    get(sala).then(async (snapshot) => {
      if (snapshot.exists()) {
        this.SalaActual = 'Sala-' + usuario1.uid + '-' + usuario2.uid;
        await localStorage.setItem("SalaActual", this.SalaActual)
        this.setOtrosChats(usuario2.uid)
      } else {
        get(sala2).then(async (snapshot) => {
          if(snapshot.exists()){
            this.SalaActual = 'Sala-' + usuario2.uid + '-' + usuario1.uid;
            await localStorage.setItem("SalaActual", this.SalaActual)
             this.setOtrosChats(usuario2.uid)
          } else {
            set(ref(this.db, 'Sala-' + usuario1.uid + '-' + usuario2.uid), {
              username1: usuario1.nombre,
              username2: usuario2.nombre
            });

            await localStorage.setItem("SalaActual", 'Sala-' + usuario1.uid + '-' + usuario2.uid)
             this.setOtrosChats(usuario2.uid);
          }
        })
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  async escritura(mensaje:any){
    const fechaActual = Math.floor(Date.now() / 1000);

    set(ref(this.db, this.SalaActual + '/chat/' + 'mensaje-' + fechaActual), {
      'mensaje': mensaje,
      'usuario':  this.auth.currentUser?.uid,
      'unix': fechaActual
    });

    await this.getMensajes();

    if(this.UsuarioPrimero.uid === this.auth.currentUser?.uid){
      this.mail.enviarEmailChat(this.UsuarioSegundo.email, mensaje, this.auth.currentUser?.displayName);
    }

    if(this.UsuarioSegundo.uid === this.auth.currentUser?.uid){
      this.mail.enviarEmailChat(this.UsuarioPrimero.email, mensaje, this.auth.currentUser?.displayName);
    }

  }

  getMensajes(): Promise<any> {
    let sala = ref(this.db, this.SalaActual);

    return get(sala).then((snapshot) => {
      if (snapshot.exists()) {
        let salaData = snapshot.val();
        let mensajes: any = [];

        for (let key in salaData.chat) {
          if (key.startsWith('mensaje-')) {
            let mensajeData = salaData.chat[key];
            mensajes.push(mensajeData);
          }
        }
        return mensajes;

      } else {
        return null;
      }
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  async getSalaActual(){
    try {
      let a = localStorage.getItem("SalaActual");
      return a;
    } catch (e) {
      console.error("Error al parsear JSON: ", e);
      return null;
    }
  }

  async setOtrosChats(uid:any){
    let otros1:any = [];

    this.usuario = await this.fire.getUserDataReal();
    let userRef1 = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.usuario.uid);
    let userRef2 = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+uid);

    let otroUsuario = await this.fire.getUserByUID(uid);
    let otros2:any = [];

    if(this.usuario.otrosChats == undefined){
      otros1.push(uid)
    } else {
      otros1 = this.usuario.otrosChats
      if(otros1.includes(uid)){

      } else {
        otros1.push(uid)
      }
    }

    await updateDoc(userRef1, {
      otrosChats: otros1
    });

    if(otroUsuario.otrosChats == undefined){
      otros2.push(uid)
    } else {
      otros2 = otroUsuario.otrosChats
      if(otros2.includes(this.usuario.uid)){

      } else {
        otros2.push(this.usuario.uid)
      }
    }

    await updateDoc(userRef2, {
      otrosChats: otros2
    });

  }

}
