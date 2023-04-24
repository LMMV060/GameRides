import { Injectable } from '@angular/core';
import { collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
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

  async actualizarTransporte(id:any, fecha:any, evento:any, precio:any, descripcion:any, coche:any){

    let transporteEditar = await doc(this.fire.basededatos(), "Transportes", id);

    await updateDoc(transporteEditar, {
      fecha: fecha,
      evento: evento,
      precio:precio,
      descripcion: descripcion,
      vehiculo:coche
    });
  }

  async getTransporteByID(id:any){
    let datos:any = [];
    const transporteRef = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    transporteRef.forEach((doc) => {

      datos.push(doc.data());
    });

    datos = datos.filter((objeto:any) => objeto.id === id);

    return datos[0];
  }
}
