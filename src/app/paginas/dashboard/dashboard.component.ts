import { Component, OnInit } from '@angular/core';
import { firebaseApp$, initializeApp } from '@angular/fire/app';
import { Auth, deleteUser, getAuth } from '@angular/fire/auth';
import { deleteDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuarios:any = [];
  peticiones:any = [];
  transportes:any = [];
  lista_negra:any = [];
  isAdmin:boolean = false;
  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  async ngOnInit(): Promise<void> {


    this.usuarios = await this.fire.getAllUsers();
    this.peticiones = await this.fire.getAllPeticiones();
    this.transportes = await this.fire.getAllTransportes();
    this.lista_negra = await this.fire.getAllBans();
    console.log(this.peticiones);

    try{
      const admin = await this.fire.getCurrentUser();

      if(admin){
        console.log("Bienvenido");

      } else {
        this.router.navigateByUrl("/error")
      }
    } catch(err){
      this.router.navigateByUrl("/error")
    }



  }

  opcionSeleccionada:any = "Usuarios";

  Busqueda(event:any){

    console.log(event.target.value);
    this.opcionSeleccionada = event.target.value;
  }

  ObtenerNombre(event:any){
    const text = event.target.value;

    console.log(text)
  }

  async eliminarUsuario(usuario:any){
    this.fire.inhabilitar(usuario);
    /*if (confirm('¿Está seguro de que desea eliminar esta petición?')) {

      await deleteDoc(doc(this.fire.basededatos(), "Usuarios", usuario.uid));

      console.log("Objeto eliminado:", usuario);
    }*/
  }

  async eliminarTransporte(Transporte:any){
    this.fire.borrarTransporte(Transporte);
  }

  async eliminarPeticion(Peticion:any){
    this.fire.borrarPeticion(Peticion);
  }

  async perdonarUsuario(usuario:any){
    this.fire.perdonarUsuario(usuario);
  }


  ObtenerNombreUsuario(event:any){
    const text = event.target.value;

    console.log(text)
  }

}
