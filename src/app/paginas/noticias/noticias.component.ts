import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent {
  noticias:any = [];
  itemsPorPagina = 2; // Número de objetos por página
  paginaActual = 0; // Índice de la página actual
  primerItem:any;
  ultimoItem:any;


  constructor(
    private fire: FirebaseService,
    private router:Router,
  ){

  }

  async ngOnInit() {
    this.noticias = await this.fire.getAllNoticias();
    this.noticias.sort((a:any, b:any) => b.fecha_creacion - a.fecha_creacion);

    this.noticias.forEach((element:any) => {

    });
  }

  convertirUnixAFecha(unix: number): string {
    const fecha = new Date(unix * 1000); // Convertir el número unix a milisegundos
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Añadir un 0 si el mes es de un solo dígito
    const dia = ('0' + fecha.getDate()).slice(-2); // Añadir un 0 si el día es de un solo dígito
    return `${anio}-${mes}-${dia}`;
  }

  avanzarPagina() {
    this.paginaActual++;
    this.primerItem = this.paginaActual * this.itemsPorPagina;
    this.ultimoItem = this.primerItem + this.itemsPorPagina;
  }

  retrocederPagina() {
    this.paginaActual--;
    this.primerItem = this.paginaActual * this.itemsPorPagina;
    this.ultimoItem = this.primerItem + this.itemsPorPagina;
  }


  irANoticia(titulo:string){
    this.router.navigateByUrl("noticias/"+titulo)
  }

}
