import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CocheService } from 'src/app/servicios/coche.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-editar-coche',
  templateUrl: './editar-coche.component.html',
  styleUrls: ['./editar-coche.component.css']
})
export class EditarCocheComponent {
  cocheAEditar:any;

  matricula:any;
  alias:any;
  plazas:any;
  constructor(
    private coche:CocheService,
    private router: Router,
    private fire: FirebaseService,
  ){

  }

  async ngOnInit() {
    this.cocheAEditar = this.coche.getCoche();

    if(this.cocheAEditar === undefined){
      const datosOferta:any = localStorage.getItem('DatosCoche');
      this.cocheAEditar = JSON.parse(datosOferta);
    } else {
      localStorage.setItem('DatosCoche', JSON.stringify(this.cocheAEditar));
    }
    this.matricula = this.cocheAEditar.matricula;
    this.alias = this.cocheAEditar.alias;
    this.plazas = this.cocheAEditar.plazas;
  }


  async guardarCambiosCoche(){

    if(/^[0-9]{4}\s[A-Z]{3}$/.test(this.matricula)){

      this.coche.guardarNuevoCoche(this.cocheAEditar.id, this.alias, this.matricula, this.plazas);
    } else {
      alert('La matrícula no cumple el formato "0000 ABC"');
    }



  }

}
