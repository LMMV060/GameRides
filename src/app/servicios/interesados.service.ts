import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteresadosService {
  interesados:any = [];
  oferta:any;

  Peticion:any
  constructor() { }

  setOferta(Oferta: any) {
    this.oferta = Oferta;
    this.interesados = this.oferta.interesados;
  }

  getOferta() {
    console.log(this.oferta);
    console.log(this.interesados);


  }
}
