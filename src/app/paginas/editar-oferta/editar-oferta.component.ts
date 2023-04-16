import { Component } from '@angular/core';
import { TransporteService } from 'src/app/servicios/transporte.service';

@Component({
  selector: 'app-editar-oferta',
  templateUrl: './editar-oferta.component.html',
  styleUrls: ['./editar-oferta.component.css']
})
export class EditarOfertaComponent {
  transporteAEditar:any;

  fecha:any
  descripcion:any
  constructor(
    private transporte: TransporteService
  ) {

  }

  async ngOnInit(){

    this.transporteAEditar = this.transporte.getTransporte();

    if(this.transporteAEditar === undefined){
      const datosOferta:any = localStorage.getItem('DatosOferta');
      this.transporteAEditar = JSON.parse(datosOferta);
    } else {
      localStorage.setItem('DatosOferta', JSON.stringify(this.transporteAEditar));
    }

    this.fecha = this.transporteAEditar.fecha;
    this.descripcion = this.transporteAEditar.descipcion;
  }


  guardarEdicion(id:any){

  }
}
