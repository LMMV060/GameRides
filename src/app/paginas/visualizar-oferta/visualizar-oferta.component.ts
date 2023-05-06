import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { RealtimeService } from 'src/app/servicios/realtime.service';
import { SmashAPIService } from 'src/app/servicios/smash-api.service';
import { TransporteService } from 'src/app/servicios/transporte.service';

@Component({
  selector: 'app-visualizar-oferta',
  templateUrl: './visualizar-oferta.component.html',
  styleUrls: ['./visualizar-oferta.component.css']
})
export class VisualizarOfertaComponent {
  datos:any;
  nombre:any;
  usuarioActual:any;
  constructor(
    private oferta:TransporteService,
    private route: ActivatedRoute,
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
    private chat:RealtimeService,
    private smash: SmashAPIService,
  ){

  }

  async ngOnInit() {

    this.datos = await this.oferta.getTransporte();
    if(this.datos === undefined){
      const VisualizarOferta:any = localStorage.getItem('VisualizarOferta');
      this.datos = JSON.parse(VisualizarOferta);

    } else {
      localStorage.setItem('VisualizarOferta', JSON.stringify(this.datos));
    }

    this.nombre = this.datos.nombre;

    console.log(this.datos);


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
      await this.fire.meInteresaTransporte(id, this.auth.currentUser?.uid)
    } else {
      alert("Por favor, inicie sesión primero")
    }
  }

  visualizarEvento(torneo:any){
    this.smash.setEvento(torneo);
    this.router.navigateByUrl("/evento");
  }

  formatDate(unix: number): string {
    const date = new Date(unix * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }

}
