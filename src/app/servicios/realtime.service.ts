import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, ref, set } from "firebase/database";
import { Chat } from 'src/app/interfaces/chat';
import { EmailService } from './email.service';
@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  //https://firebase.google.com/docs/database/web/read-and-write?hl=es-419
  constructor(
    private auth:Auth,
    private mail: EmailService
  ) { }

  private db = getDatabase();

  private UsuarioPrimero:any;
  private UsuarioSegundo:any;

  private SalaActual:any;

  chat(usuario1:any, usuario2:any) {
    this.UsuarioPrimero = usuario1;
    this.UsuarioSegundo = usuario2;


    let sala = ref(this.db, 'Sala-' + usuario1.uid + '-' + usuario2.uid);

    let sala2 = ref(this.db, 'Sala-' + usuario2.uid + '-' + usuario1.uid);

    get(sala).then((snapshot) => {
      if (snapshot.exists()) {
        this.SalaActual = 'Sala-' + usuario1.uid + '-' + usuario2.uid;
      } else {
        get(sala2).then((snapshot) => {
          if(snapshot.exists()){
            this.SalaActual = 'Sala-' + usuario2.uid + '-' + usuario1.uid;
          } else {
            set(ref(this.db, 'Sala-' + usuario1.uid + '-' + usuario2.uid), {
              username1: usuario1.nombre,
              username2: usuario2.nombre
            });
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

}
