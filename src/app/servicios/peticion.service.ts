import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

  Peticion: any;

  constructor(
    private fire: FirebaseService,
    private router: Router
  ) { }

  setPeticion(Peticion: any) {
    this.Peticion = Peticion;
  }

  getPeticion() {
    return this.Peticion;
  }

  async guardarNuevaPeticion(id:any, fecha:any, evento:any, precio:any, descripcion:any){

    let peticionEditar = await doc(this.fire.basededatos(), "Peticiones", id);

    await updateDoc(peticionEditar, {
      evento: evento,
      precio:precio,
      descripcion: descripcion,
      fecha: fecha
    });

  }

  async getPeticionByID(id:any){
    let datos:any = [];
    const transporteRef = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    transporteRef.forEach((doc) => {

      datos.push(doc.data());
    });

    datos = datos.filter((objeto:any) => objeto.id === id);

    return datos[0];
  }
}
