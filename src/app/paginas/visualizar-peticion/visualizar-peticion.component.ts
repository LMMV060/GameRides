import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PeticionService } from 'src/app/servicios/peticion.service';
import { RealtimeService } from 'src/app/servicios/realtime.service';
import { SmashAPIService } from 'src/app/servicios/smash-api.service';

@Component({
  selector: 'app-visualizar-peticion',
  templateUrl: './visualizar-peticion.component.html',
  styleUrls: ['./visualizar-peticion.component.css']
})
export class VisualizarPeticionComponent {

  datos:any;
  nombre:any;
  usuarioActual:any;

  constructor(
    private peticion:PeticionService,
    private smash:SmashAPIService,
    private router:Router,
    private chat:RealtimeService,
    private fire:FirebaseService,
    private auth:Auth,
  ){

  }

  async ngOnInit() {
    this.datos = await this.peticion.getPeticion();

    if(this.datos === undefined){
      const VisualizaPeticion:any = localStorage.getItem('VisualizaPeticion');
      this.datos = JSON.parse(VisualizaPeticion);

    } else {
      localStorage.setItem('VisualizaPeticion', JSON.stringify(this.datos));
    }

  }

  visualizarEvento(torneo:any){
    this.smash.setEvento(torneo);
    this.router.navigateByUrl("/evento");
  }

  async chatear(){
    let usuarios:any = [];

    usuarios = await this.fire.getAllUsers();

    this.usuarioActual = usuarios.filter((objeto:any) => objeto.uid === this.datos.uid);
    const usuarioActual = await this.fire.getUserDataReal();

    this.chat.chat(usuarioActual, this.usuarioActual[0]);

    this.router.navigateByUrl("/mis-chats")
  }

  async interesado(id:any){
    if(this.auth.currentUser){
      await this.fire.meInteresaPeticion(id, this.auth.currentUser?.uid);
    } else {
      alert("Por favor, inicie sesión primero")
    }
  }
}
