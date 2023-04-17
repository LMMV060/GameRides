import { Injectable } from '@angular/core';
import { doc, updateDoc } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {

  transporte: any;

  constructor(
    private fire: FirebaseService,
  ) { }

  setTransporte(transporte: any) {
    this.transporte = transporte;
  }

  getTransporte() {
    return this.transporte;
  }

  async actualizarTransporte(id:any, fecha:any, evento:any,  descripcion:any, coche:any){

    let transporteEditar = await doc(this.fire.basededatos(), "Transportes", id);

    await updateDoc(transporteEditar, {
      fecha: fecha,
      evento: evento,
      descripcion: descripcion,
      vehiculo:coche
    });
  }
}
