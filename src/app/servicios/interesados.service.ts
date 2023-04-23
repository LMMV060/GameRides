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

    let prueba = await this.fire.getAllTransportes()

    prueba = prueba.filter((transporte:any) => transporte.id === idOferta);
    let rechazados:any = [];

    if(prueba[0].rechazados === undefined){
      rechazados.push(uid);
    } else {
      rechazados = prueba[0].rechazados
      if(rechazados.includes(uid)){

      } else {
        rechazados.push(uid)
      }
    }
    await updateDoc(ofertaInteresada, {
      rechazados: rechazados
    });

  }

  async aceptar(uid:any, idOferta:any){
    let ofertaInteresada = await doc(this.fire.basededatos(), "Transportes", idOferta);

    let usuario:any

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        usuario = data;
      }
    });

    let prueba = await this.fire.getAllTransportes()

    prueba = prueba.filter((transporte:any) => transporte.id === idOferta);
    let aceptados:any = [];
    //Acepta al usuario como que esta aceptado
    console.log("Aceptando al usuario: " + usuario.nombre);
    await updateDoc(ofertaInteresada, {
      interesados:arrayRemove(usuario.uid)
    });

    if(prueba[0].aceptados === undefined){
      aceptados.push(uid);
    } else {
      aceptados = prueba[0].aceptados
      if(aceptados.includes(uid)){

      } else {
        aceptados.push(uid)
      }
    }
    await updateDoc(ofertaInteresada, {
      aceptados: aceptados
    });

    prueba = await this.fire.getAllTransportes()

    prueba = prueba.filter((transporte:any) => transporte.id === idOferta);

    //Al usuario aceptado se le da el transporte aceptado para recordarselo en su perfil
    let actualizaUsuario:any = [];
    actualizaUsuario = await this.fire.getAllUsers();

    actualizaUsuario = actualizaUsuario.filter((usuario:any) => usuario.uid === uid);
    let ofertasA:any = [];
    let usuarioRef = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+actualizaUsuario[0].uid);

    if(actualizaUsuario[0].ofertasAceptadas === undefined){
      ofertasA.push(prueba[0])
    } else {
      ofertasA = actualizaUsuario[0].ofertasAceptadas
      if(ofertasA.includes(prueba[0])){

      } else {
        ofertasA.push(prueba[0])
      }
    }

    await updateDoc(usuarioRef, {
      ofertasAceptadas: ofertasA
    })
    console.log(actualizaUsuario[0].uid);


  }

  async actualizarOferta(idOferta:any){
    let ofertaInteresada:any;

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    querySnapshot.forEach((doc) => {
      let datos:any = doc.data();
      if(datos.id === idOferta){
        ofertaInteresada = datos
      }
    });
    return ofertaInteresada;

  }

}
