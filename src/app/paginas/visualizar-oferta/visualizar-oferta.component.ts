import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { RealtimeService } from 'src/app/servicios/realtime.service';
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

    console.log("Usuario principal", usuarioActual);
    console.log("Otro usuario", this.usuarioActual[0]);



    this.chat.chat(usuarioActual, this.usuarioActual[0]);

    this.router.navigateByUrl("/mis-chats")
  }

}
