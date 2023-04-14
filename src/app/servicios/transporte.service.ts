import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {

  transporte: any;

  constructor() { }

  setTransporte(transporte: any) {
    this.transporte = transporte;
  }

  getTransporte() {
    return this.transporte;
  }
}
