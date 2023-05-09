import { Component, OnInit } from '@angular/core';
import { Auth, deleteUser } from '@angular/fire/auth';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';
import { deleteDoc, doc } from '@angular/fire/firestore';
import { EncriptadoService } from 'src/app/servicios/encriptado.service';
import { RealtimeService } from 'src/app/servicios/realtime.service';
import { FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent implements OnInit {
  isDeleting:boolean = false;

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
    private router: Router,
    private encry: EncriptadoService,
    private chat: RealtimeService,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.fire.getUserDataReal();

    if(!this.currentUser){
      alert("Disculpe las molestias, se va a borrar su cuenta de forma correcta")
      await this.borrarError();
    }
    if(this.currentUser.password === "??????"){
      this.cuentaGoogle = true;
    }


  }

  async mostrarMensaje(item: { nombre: string; }) {
    if (item.nombre === 'Cambiar email') {
      this.mensaje = item.nombre;
    } else if (item.nombre === 'Cambiar contraseña') {
      this.mensaje = item.nombre;
    } else if (item.nombre === 'Borrar cuenta'){
      this.mensaje = item.nombre
    }
  }

  //Cambiar email (Siendo cuenta normal, y no de google)
  emailActual:any;
  emailNuevo:any;
  emailConfirmar:any;
  pwdEmail:any;

  cambiarEmail(){
    if(this.auth.currentUser?.email === this.emailActual){
      if(this.emailNuevo === this.emailConfirmar){
        if (this.encry.decryptData(this.pwdEmail) === this.encry.decryptData(this.currentUser.password)) {
          //Comienda a cambiar el email
          this.fire.updateEmail(this.auth.currentUser?.uid,this.emailNuevo);
        } else {
          alert("Contraseña erronea")
        }
      } else {
        alert("Error: El nuevo email no es el mismo para confirmar")
      }
    } else {
      alert("Error: El email no es el de la sesión actual")
    }
  }

  //Cambiar PWD
  pwdActual:any;
  pwdNuevo:any;
  pwdConfirmar:any;
  cambiarPwd(){
    if (this.encry.decryptData(this.pwdActual) === this.encry.decryptData(this.currentUser.password)) {
      if(this.pwdNuevo === this.pwdConfirmar){
        if(this.pwdNuevo === "" || !this.pwdNuevo){
          alert("Cambio de contraseña vacia")
        } else {
          //Empieza a cambiar la contraseña
          //this.pwdNuevo = crypto.SHA512(this.pwdNuevo).toString();
          this.fire.updatePwd(this.auth.currentUser?.uid,this.pwdNuevo);
        }
      } else {
        alert("La nueva contraseña no coincide con la confirmación");
      }
    } else {
      alert('La contraseña no coincide con la de esta sesión');
    }
  }

  //Borrar cuenta
  emailBorrar:any;
  pwdBorrar:any;

  async borrarCuenta(){
    if(this.auth.currentUser?.email == this.emailBorrar){
      if (this.encry.decryptData(this.pwdBorrar) === this.encry.decryptData(this.currentUser.password)) {
        //empieza a borrar
        this.isDeleting = true;
        try{
          await this.fire.deleteAllFromUser(this.currentUser.uid).then(async ()=> {
            await this.chat.borrarSalas(this.auth.currentUser?.uid);
            await this.fire.finallyDeletUser();
          })
        }catch(err){
          alert("Ha ocurrido un error, cierre sesión, inicie sesión de nuevo y vuelva a intentarlo")
        } finally {
          this.isDeleting = false;
        }
      } else {
        alert('La contraseña no coincide');
      }
    } else {
      alert("Error: El email no es el de la sesión actual")
    }
  }

  async borrarCuentaGoogle(){
    if(this.auth.currentUser?.email == this.emailBorrar){
      this.isDeleting = true;
      try{
        await this.fire.deleteAllFromUser(this.currentUser.uid).then(async ()=> {
          await this.chat.borrarSalas(this.auth.currentUser?.uid);
          await this.fire.finallyDeletUser();
        })
      }catch(err){
        alert("Ha ocurrido un error, cierre sesión, inicie sesión de nuevo y vuelva a intentarlo")
      } finally {
        this.isDeleting = false;
      }
    } else {
      alert("Error: El email no es el de la sesión actual")
    }
  }

  async borrarError(){
    this.isDeleting = true;
    try{
      this.fire.finallyDeletUser();
    }
    catch(err){

      alert("Ha ocurrido un error, cierre sesión, inicie sesión de nuevo y vuelva a intentarlo")
    } finally {
      this.isDeleting = false;
    }
  }

}
