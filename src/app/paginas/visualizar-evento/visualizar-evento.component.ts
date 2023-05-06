import { Component } from '@angular/core';
import { SmashAPIService } from 'src/app/servicios/smash-api.service';

@Component({
  selector: 'app-visualizar-evento',
  templateUrl: './visualizar-evento.component.html',
  styleUrls: ['./visualizar-evento.component.css']
})
export class VisualizarEventoComponent {
  evento:any;
  constructor(
    private smash: SmashAPIService,
  ){

  }

  async ngOnInit() {
    this.evento = await this.smash.getEvento();

    if(this.evento.length === 0){
      const datosEvento:any = localStorage.getItem('EventoVisualizacion');
      this.evento = JSON.parse(datosEvento);

    } else {
      localStorage.setItem('EventoVisualizacion', JSON.stringify(this.evento));
    }

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
