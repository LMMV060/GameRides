import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { get, getDatabase, ref, set } from "firebase/database";
import { Chat } from 'src/app/interfaces/chat';
@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  //https://firebase.google.com/docs/database/web/read-and-write?hl=es-419
  constructor(
    private auth:Auth,
  ) { }

  private db = getDatabase();

  private UsuarioPrimero:any;
  private UsuarioSegundo:any;

  chat(usuario1:any, usuario2:any) {
    this.UsuarioPrimero = usuario1;
    this.UsuarioSegundo = usuario2;

    let sala = ref(this.db, 'Sala-' + usuario1.uid + '-' + usuario2.uid);

    get(sala).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Existe");

      } else {
        set(ref(this.db, 'Sala-' + usuario1.uid + '-' + usuario2.uid), {
          username1: usuario1.nombre,
          username2: usuario2.nombre
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  escritura(mensaje:any){
    const fechaActual = new Date().toString();

    set(ref(this.db, 'Sala-' + this.UsuarioPrimero.uid + '-' + this.UsuarioSegundo.uid + '/chat/' + 'mensaje-' + fechaActual), {
      'mensaje': mensaje,
      'usuario':  this.auth.currentUser?.uid
    });

    this.getMensajes();

  }

  getMensajes(): Promise<any> {
    let sala = ref(this.db, 'Sala-' + this.UsuarioPrimero.uid + '-' + this.UsuarioSegundo.uid);

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

        console.log('Mensajes:', mensajes);

        return mensajes;

      } else {
        console.log('Error: la variable "sala" no existe en la base de datos');
        return null;
      }
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

}
