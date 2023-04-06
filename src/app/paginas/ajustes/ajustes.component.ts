import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent implements OnInit {

  currentUser:any;
  cuentaGoogle:boolean = false;
  ajustes = [
    { nombre: 'Cambiar email' },
    { nombre: 'Cambiar contraseña' },
    { nombre: 'Borrar cuenta' },
  ];

  mensaje:string = 'Cambiar email';

  constructor(
    private auth: Auth,
    private fire: FirebaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.currentUser = await this.fire.getUserDataReal();
    console.log(this.currentUser.password);

    if(this.currentUser.password === "?"){
      this.cuentaGoogle = true;
    }
    if (crypto.SHA512('123456').toString() === this.currentUser.password) {
      console.log('Las claves coinciden');
    } else {
      console.log('Las claves no coinciden');
    }

  }

  async mostrarMensaje(item: { nombre: string; }) {
    if (item.nombre === 'Cambiar email') {
      this.mensaje = item.nombre;
      console.log(this.mensaje);
    } else if (item.nombre === 'Cambiar contraseña') {
      this.mensaje = item.nombre;
      console.log(this.mensaje);
    } else if (item.nombre === 'Borrar cuenta'){
      this.mensaje = item.nombre
      console.log(this.mensaje);
    }
  }


  //Borrar cuenta
  emailBorrar:any;
  pwdBorrar:any;

  async borrarCuenta(){

    if(this.auth.currentUser?.email == this.emailBorrar){
      if (crypto.SHA512(this.pwdBorrar).toString() === this.currentUser.password) {
        //empieza a borrar
        this.fire.deleteAllFromUser(this.currentUser.uid);

        this.router.navigateByUrl("/home")
      } else {
        alert('La contraseña no coincide');
      }

    } else {
      alert("Error: El email no es el de la sesión actual")
    }
  }

}
