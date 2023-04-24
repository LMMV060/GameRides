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
}
