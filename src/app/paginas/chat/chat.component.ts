
import { ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EmailService } from 'src/app/servicios/email.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

import { RealtimeService } from 'src/app/servicios/realtime.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  @ViewChild('messagesContainer') messagesContainer: any;


  constructor(
    private fire: FirebaseService,
    private chat:RealtimeService,
    private auth:Auth,
    
  ) {
  }

  mensajes:any;
  newMessage: string = '';

  uid = this.auth.currentUser?.uid;


  async ngOnInit() {

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
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  async cargarMensajes(){
    await this.chat.getMensajes().then((mensajes:any) => {
      this.mensajes = mensajes;
    });
  }

}
