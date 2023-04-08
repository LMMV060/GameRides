import { FirebaseService } from './../../servicios/firebase.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { Auth, deleteUser } from '@angular/fire/auth';
import { doc, setDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { collection, getDocFromCache, getDocs } from 'firebase/firestore';

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
    ) { }
  email:string = "";
  pwd:string = "";


  ngOnInit(): void {
    if(!this.auth.currentUser){
      console.log("Login");
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  ObtenerEmail(event:any){
    const email = event.target.value;
    console.log('Valor del input:', email);
    this.email = email;
  }

  ObtenerPWD(event:any){
    const pwd = event.target.value;
    console.log('PWD:', pwd);
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
          isDisabled:true
        }
        console.log("Estas baneado: ",usuarioBan);

        const ban = await setDoc(doc(this.fire.basededatos(), "Lista_Negra", "Ban-"+this.auth.currentUser?.uid), usuarioBan)
        //const borrarUsuario = await deleteDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser));

        this.auth.signOut();
      } else {
        console.log(response);
        console.log("Usuario con el email: " + this.email);
        console.log("Logeado con la contraseña "+ this.pwd);
        this.router.navigateByUrl('/home');
      }


    })
    .catch(error => console.log(error)
    )

  }

  async LoginWithGoogle(){

    this.fire.loginWithGoogle()
    .then(async response => {
      console.log(response);

      if(this.auth.currentUser && this.auth.currentUser.displayName && this.auth.currentUser.photoURL){
        const usuario:Usuarios= {
          uid:this.auth.currentUser.uid,
          nombre: this.auth.currentUser.displayName,
          imgUrl: this.auth.currentUser.photoURL,
          password: "?",
          isAdmin: false,
          isDisabled:false
        };

        const query = await getDocs(collection(this.fire.basededatos(), "Usuarios"))
        let filtro:any = undefined;
        query.forEach((doc) => {
          if(doc.id == "Usuario-"+this.auth.currentUser?.uid){
            filtro = doc.data();
          }
        })

        if(filtro == undefined){
          const respuesta = await setDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser.uid), usuario);
          this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, this.auth.currentUser.photoURL);
          console.log("Usuario creado");
        } else {
          if(filtro.isDisabled){
            const usuarioBan:Usuarios = {
              uid:this.auth.currentUser.uid,
              nombre: this.auth.currentUser.displayName,
              imgUrl: this.auth.currentUser.photoURL,
              password: "",
              isAdmin: false,
              isDisabled:true
            }
            console.log("Estas baneado: ",usuarioBan);

            const ban = await setDoc(doc(this.fire.basededatos(), "Lista_Negra", "Ban-"+this.auth.currentUser.uid), usuarioBan)
            const borrarUsuario = await deleteDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser));

            this.auth.signOut();

          } else {
            console.log("Bienvenido");
            this.router.navigateByUrl('/home');
          }

        }


      }
    })
    .catch(error => console.log(error));
  }
}
