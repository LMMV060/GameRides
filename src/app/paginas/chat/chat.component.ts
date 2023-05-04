import { ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EmailService } from 'src/app/servicios/email.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

import { RealtimeService } from 'src/app/servicios/realtime.service';
import * as io from 'socket.io-client';
import { getDatabase } from 'firebase/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  @ViewChild('messagesContainer') messagesContainer: any;


  constructor(
    private chat:RealtimeService,
    private auth:Auth,
    private fire: FirebaseService
  ) {
  }

  mensajes:any;
  newMessage: string = '';

  uid = this.auth.currentUser?.uid;

  otrosUsuarios:any = [];

  mensajesRef:any;
  mensajes$:any = []

  user:any;

  comprobador:any;


  async ngOnInit() {

    this.comprobador = this.chat.UsuarioPrimero;

    this.user = await this.fire.getUserDataReal();

    for(let i = 0; i < this.user.otrosChats.length;i++){
      let usuario = await this.fire.getUserByUID(this.user.otrosChats[i]);
      this.otrosUsuarios.push(usuario);
    }


    await this.chat.getMensajes().then((mensajes:any) => {
      this.mensajes = mensajes;
    });

    let mensajesAnteriores = [];

    setInterval(async () => {
      await this.chat.getMensajes().then((mensajes:any) => {
        if (mensajes.length !== mensajesAnteriores.length) { // Si la longitud del arreglo ha cambiado
          this.mensajes = mensajes;
          this.scrollToBottom(); // Desplazar el div de mensajes hacia abajo
        }
        mensajesAnteriores = mensajes; // Actualizar la longitud anterior del arreglo
      });
    }, 100);


    this.scrollToBottom();
  }

  async sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.chat.escritura(this.newMessage);
      this.newMessage = '';

      await this.chat.getMensajes().then((mensajes:any) => {
        this.mensajes = mensajes;
      });
      this.scrollToBottom();
    }
  }


  scrollToBottom() {
    if(this.comprobador){
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }, 0);
    }

  }

  async cargarMensajes(){
    await this.chat.getMensajes().then((mensajes:any) => {
      this.mensajes = mensajes;
    });
  }

  formatDate(unix: number): string {
    const date = new Date(unix * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `[ ${hours} : ${minutes} : ${seconds} ] ${day} / ${month} / ${year}`;
  }

  chatear(Usuario:any){
    this.comprobador = Usuario;

    this.chat.chat(this.user, Usuario);
  }
}
