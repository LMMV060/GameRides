import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmailInteresado(EmailAEnviar:any){
    let emailParams = {
      from_email: 'GameRides',
      from_name: 'GameRides',
      to_email: EmailAEnviar,
      subject: 'Una nueva persona se ha interesado en su oferta',
      //message_html: 'Lol'
    };

    emailjs.send('service_oqlhvny', 'template_a56hsbf', emailParams, 'MxbfF8StlKGfU3P8-')
    .then(function(response) {

    }, function(error) {

    });
  }

  enviarEmailChat(EmailAEnviar:any, mensaje:any, usuario:any){
    let emailParams = {
      from_email: 'GameRides',
      from_name: 'GameRides',
      to_email: EmailAEnviar,
      subject: 'Una nueva persona se ha interesado en su oferta',
      message_html: mensaje
    };

    emailjs.send('service_oqlhvny', 'template_53g6ejy', emailParams, 'MxbfF8StlKGfU3P8-')
    .then(function(response) {

    }, function(error) {

    });
  }

  enviarEmailInteresadoPeticion(EmailAEnviar:any){
    let emailParams = {
      from_email: 'GameRides',
      from_name: 'GameRides',
      to_email: EmailAEnviar,
      subject: 'Una nueva persona se ha interesado en su petición',
    };

    emailjs.send('service_oqlhvny', 'template_z9fiy9r', emailParams, 'MxbfF8StlKGfU3P8-')
    .then(function(response) {

    }, function(error) {

    });
  }

}
