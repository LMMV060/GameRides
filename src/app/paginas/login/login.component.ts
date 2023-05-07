import { FirebaseService } from './../../servicios/firebase.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { Auth, deleteUser, updatePassword } from '@angular/fire/auth';
import { doc, setDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { collection, getDocFromCache, getDocs } from 'firebase/firestore';
import { Location } from '@angular/common';
import * as crypto from 'crypto-js';
import { AES } from 'crypto-js';
import { EncriptadoService } from 'src/app/servicios/encriptado.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
    private location:Location,
    private encry: EncriptadoService
    ) { }
  email:string = "";
  pwd:string = "";


  ngOnInit(): void {
    if(!this.auth.currentUser){

    } else {
      this.router.navigateByUrl('/home');
    }
  }

  ObtenerEmail(event:any){
    const email = event.target.value;
    this.email = email;
  }

  ObtenerPWD(event:any){
    const pwd = event.target.value;
    this.pwd = pwd;
  }

  async Login(){
    this.fire.login(this.email, this.pwd)
    .then(async response => {

      const query = await getDocs(collection(this.fire.basededatos(), "Usuarios"))
        let filtro:any = undefined;
        query.forEach((doc) => {
          if(doc.id == "Usuario-"+this.auth.currentUser?.uid){
            filtro = doc.data();
          }
        })

      if(filtro.isDisabled){
        const usuarioBan:Usuarios = {
          uid:this.auth.currentUser?.uid || "",
          nombre: this.auth.currentUser?.displayName || "",
          imgUrl: this.auth.currentUser?.photoURL|| "",
          password: "",
          isAdmin: false,
          isDisabled:true,
          descripcion: "",
          email: this.auth.currentUser?.email
        }
        alert("Estas baneado");

        const ban = await setDoc(doc(this.fire.basededatos(), "Lista_Negra", "Ban-"+this.auth.currentUser?.uid), usuarioBan)
        //const borrarUsuario = await deleteDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser));

        this.auth.signOut();
      } else {
        this.router.navigateByUrl('/home');
      }


    })
    .catch(error => {
      const errorEmail = document.getElementById("emailError");
      if(errorEmail){
        if (error.code === "auth/invalid-email") {
          errorEmail.innerHTML = "Error: Dirección de correo electrónico inválida.";
        } else if (error.code === "auth/user-not-found") {
          errorEmail.innerHTML = "Error: El correo electrónico ingresado no está registrado.";
        } else {
          errorEmail.innerHTML = ""
        }
      }
      const errorPWD = document.getElementById("pwdError");
      if(errorPWD){
        if(error.code === "auth/wrong-password") {
          errorPWD.innerHTML = "Error: Contraseña incorrecta.";
        } else {
          errorPWD.innerHTML = "";
        }
      }
    })

  }

  async LoginWithGoogle(){
    this.fire.loginWithGoogle()
    .then(async response => {

      if(this.auth.currentUser && this.auth.currentUser.displayName && this.auth.currentUser.photoURL){
        const usuario:Usuarios= {
          uid:this.auth.currentUser.uid,
          nombre: this.auth.currentUser.displayName,
          imgUrl: this.auth.currentUser.photoURL,
          password: "??????",
          isAdmin: false,
          isDisabled:false,
          descripcion: "",
          email: this.auth.currentUser?.email
        };

        const query = await getDocs(collection(this.fire.basededatos(), "Usuarios"))
        let filtro:any = undefined;
        query.forEach((doc) => {
          if(doc.id == "Usuario-"+this.auth.currentUser?.uid){
            filtro = doc.data();
          }
        })

        if(filtro === undefined){
          const respuesta = await setDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser.uid), usuario);
          this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, this.auth.currentUser.photoURL);
          this.router.navigateByUrl('/home').then(() => {
            this.location.go('/home');
            window.location.reload();
          });
        } else {
          if(filtro.isDisabled){
            const usuarioBan:Usuarios = {
              uid:this.auth.currentUser.uid,
              nombre: this.auth.currentUser.displayName,
              imgUrl: this.auth.currentUser.photoURL,
              password: "",
              isAdmin: false,
              isDisabled:true,
              descripcion: "",
              email: this.auth.currentUser?.email
            }
            alert("Estas baneado");

            const ban = await setDoc(doc(this.fire.basededatos(), "Lista_Negra", "Ban-"+this.auth.currentUser.uid), usuarioBan)
            const borrarUsuario = await deleteDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser));

            this.auth.signOut();

          } else {
            var pass = await this.encry.decryptData(filtro.password);

            updatePassword(this.auth.currentUser,pass).then(() => {
                this.router.navigateByUrl('/home').then(() => {
                this.location.go('/home');
                window.location.reload();
              });
            })
          }
        }
      }
    })
    .catch(error => console.log(error));
  }


}
