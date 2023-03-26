import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
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
  ) { }
  email:string = "";
  pwd:string = "";
  nombre:string = "";

  ngOnInit(): void {
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

  ObtenerNombre(event:any){
    const nombre = event.target.value;
    console.log('Nombre:', nombre);
    this.nombre = nombre;
  }

  Register(){
    this.fire.register(this.email, this.pwd, this.nombre)
    .then(async () => {
      if(this.auth.currentUser){
        const usuario:Usuarios= {
          uid:this.auth.currentUser.uid,
          nombre: this.nombre,
          imgUrl: "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png",
          isAdmin: false
        };

        const response = await setDoc(doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser.uid), usuario)
        console.log("Usuario creado");
        this.router.navigate(["/home"]);
      }
    })

  }

}
