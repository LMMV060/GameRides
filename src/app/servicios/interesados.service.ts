import { Injectable } from '@angular/core';
import { collection, doc, getDocs, getFirestore, updateDoc } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { arrayRemove } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class InteresadosService {
  interesados:any = [];
  oferta:any;

  Peticion:any
  constructor(
    private fire:FirebaseService,
  ) { }

  setOferta(Oferta: any) {
    this.oferta = Oferta;
    this.interesados = this.oferta.interesados;
  }

  getOferta() {
    //console.log(this.oferta);
    //console.log(this.interesados);
    return this.oferta;
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

  async rechazar(uid:any, idOferta:any){
    let ofertaInteresada = await doc(this.fire.basededatos(), "Transportes", idOferta);

    let usuario:any
    let nuevosInteresados:any;

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        usuario = data;
      }
    });

    console.log("Rechazando al usuario: " + usuario.nombre);
    await updateDoc(ofertaInteresada, {
      interesados:arrayRemove(usuario.uid)
    });

    const queryIntereses = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    queryIntereses.forEach((doc) => {
      const data:any = doc.data();
      if(data.id === idOferta){
        //console.log(data.interesados);
        nuevosInteresados = data.interesados;
      }
    });


    return nuevosInteresados;
  }
}
