import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  constructor(
    private fire:FirebaseService,
    private router:Router,
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
    this.fire.register(this.email, this.pwd, this.nombre);
  }

}
