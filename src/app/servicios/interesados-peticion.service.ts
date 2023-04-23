import { Injectable } from '@angular/core';
import { collection, getDocs } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class InteresadosPeticionService {

  interesados:any = [];
  peticion:any;

  constructor(
    private fire:FirebaseService
  ) { }

  setPeticion(peticion: any) {
    this.peticion = peticion;
    this.interesados = this.peticion.interesados;
  }

  getPeticion() {
    //console.log(this.oferta);
    //console.log(this.interesados);
    return this.peticion;
  }

  datos:any;
  async getInteresados(uid:any){
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        this.datos = data;
      }

    });

    return this.datos
  }
}
