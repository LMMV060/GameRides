import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import * as crypto from 'crypto-js';
import { Location } from '@angular/common';
import { EncriptadoService } from 'src/app/servicios/encriptado.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
    private location: Location,
    private crypt:EncriptadoService
  ) { }
  email:string = "";
  pwd:string = "";
  nombre:string = "";

  ngOnInit(): void {
  }

  ObtenerEmail(event:any){
    const email = event.target.value;
    this.email = email;
  }

  ObtenerPWD(event:any){
    const pwd = event.target.value;
    this.pwd = pwd;
  }

  ObtenerNombre(event:any){
    const nombre = event.target.value;
    this.nombre = nombre;
  }

  creaUsuario:boolean = true;
  async Register(){
    this.creaUsuario = true;
    let datos:any = [];
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      datos.push(doc.data());
    });

    datos.forEach((doc:any) => {
      //console.log(doc.nombre);

      if(doc.nombre == this.nombre){
        this.creaUsuario = false;
      }
    })

    if(this.creaUsuario == true){
      if(!this.nombre){
        alert("No hay nombre de usuario")
      } else {
        this.fire.register(this.email, this.pwd, this.nombre)
      .then(async () => {
        if(this.auth.currentUser){
          const usuario:Usuarios= {
            uid:this.auth.currentUser.uid,
            nombre: this.nombre,
            imgUrl: "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png",
            password: this.crypt.encryptData(this.pwd),
            isAdmin: false,
            isDisabled: false,
            descripcion: "",
            email: this.auth.currentUser?.email
          };

          this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png");

          const response = await setDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser.uid), usuario)
          alert("Usuario registrado");
          this.router.navigateByUrl('/home').then(() => {
            this.location.go('/home');
            window.location.reload();
          });
        } else {
          alert("No hay nombre")
        }
      })
      .catch(error => {
        const errorEmail = document.getElementById("emailError");
        if(errorEmail){
          if (error.code === "auth/email-already-in-use") {
            errorEmail.innerHTML = "Error: La dirección de correo electrónico ya está siendo utilizada por otra cuenta.";
          } else {
            errorEmail.innerHTML = "";
          }
        }

        const errorPWD = document.getElementById("pwdError");
        if(errorPWD){
          if (error.code === "auth/weak-password") {
            errorPWD.innerHTML = "Error: La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
          } else {
            errorPWD.innerHTML = "";

          }
        }
      })
      }
    } else {
      alert("Usuario con nombre " + this.nombre + " ya registrado");
    }
  }

}
