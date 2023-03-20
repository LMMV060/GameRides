import { FirebaseService } from './../../servicios/firebase.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

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
    .then(response => {
      console.log(response);
      console.log("Usuario con el email: " + this.email);
    console.log("Logeado con la contraseña "+ this.pwd);
    this.router.navigateByUrl('/home');

    })
    .catch(error => console.log(error)
    )

  }

  async LoginWithGoogle(){
    this.fire.loginWithGoogle()
    .then(response => {
      console.log(response);
      this.router.navigateByUrl('/home');
    })
    .catch(error => console.log(error));
  }


  /*Registrar
  this.fire.register(this.email, this.pwd)
    .then(response => {
      console.log(response);

    })
    .catch(error => console.log(error)
    )
  */
}
