import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

  Peticion: any;

  constructor(
    private fire: FirebaseService
  ) { }

  setPeticion(Peticion: any) {
    this.Peticion = Peticion;
  }

  getPeticion() {
    return this.Peticion;
  }

  async guardarNuevaPeticion(id:any, fecha:any, evento:any, descripcion:any){
    let peticionEditar = await doc(this.fire.basededatos(), "Peticiones", id);

    await updateDoc(peticionEditar, {
      evento: evento,
      descripcion: descripcion,
      fecha: fecha
    });

  }
}
