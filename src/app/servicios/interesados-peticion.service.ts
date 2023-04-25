import { Injectable } from '@angular/core';
import { arrayRemove, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
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

  async aceptar(uid:any, idPeticion:any){
    let peticionInteresada = await doc(this.fire.basededatos(), "Peticiones", idPeticion);

    let usuario:any

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        usuario = data;
      }
    });

    let prueba = await this.fire.getAllPeticiones();

    prueba = prueba.filter((transporte:any) => transporte.id === idPeticion);
    let aceptados:any = [];
    //Acepta al usuario como que esta aceptado
    await updateDoc(peticionInteresada, {
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
    await updateDoc(peticionInteresada, {
      aceptados: aceptados
    });

    prueba = await this.fire.getAllPeticiones();

    prueba = prueba.filter((transporte:any) => transporte.id === idPeticion);

    //Al usuario aceptado se le da el transporte aceptado para recordarselo en su perfil
    let actualizaUsuario:any = [];
    actualizaUsuario = await this.fire.getAllUsers();

    actualizaUsuario = actualizaUsuario.filter((usuario:any) => usuario.uid === uid);
    let peticionesAceptadas:any = [];
    let usuarioRef = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+actualizaUsuario[0].uid);

    if(actualizaUsuario[0].peticionesAceptadas === undefined){
      peticionesAceptadas.push(prueba[0])
    } else {
      peticionesAceptadas = actualizaUsuario[0].peticionesAceptadas
      if(peticionesAceptadas.includes(prueba[0])){

      } else {
        peticionesAceptadas.push(prueba[0])
      }
    }
    await updateDoc(usuarioRef, {
      peticionesAceptadas: peticionesAceptadas
    })

  }

  async rechazar(uid:any, idPeticion:any){
    let peticionInteresada = await doc(this.fire.basededatos(), "Peticiones", idPeticion);

    let usuario:any

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        usuario = data;
      }
    });

   await updateDoc(peticionInteresada, {
      interesados:arrayRemove(usuario.uid)
    });

    let prueba = await this.fire.getAllPeticiones();

    prueba = prueba.filter((transporte:any) => transporte.id === idPeticion);
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
    await updateDoc(peticionInteresada, {
      rechazados: rechazados
    });

  }

  async actualizarPeticion(idPeticion:any){
    let peticionInteresada:any;

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {
      let datos:any = doc.data();
      if(datos.id === idPeticion){

        peticionInteresada = datos
      }
    });
    return peticionInteresada;
  }

  async getConductor(id:any){
    let uid:any;
    let usuario:any;

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {
      let datos:any = doc.data();
      if(datos.id === id){
        if(datos.aceptados){
          uid = datos.aceptados[0]
        }
      }
    });

    const usuarioRef = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    usuarioRef.forEach((doc) => {
      let datos:any = doc.data();
      if(datos.uid === uid){
        usuario = datos
      }
    });

    return usuario;
  }

  async borrarConductor(uid:any, idPeticion:any){
    let peticionInteresada = await doc(this.fire.basededatos(), "Peticiones", idPeticion);
    let peticionABorrar:any;

    let usuario:any

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      const data:any = doc.data();
      if (data.uid === uid) { // Filtra los datos según el uid
        usuario = data;
      }
    });

    const peticionRef = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    peticionRef.forEach((doc) => {
      const data:any = doc.data();
      if (data.id === idPeticion) { // Filtra los datos según el uid
        peticionABorrar = data;
      }
    });

    if(confirm('¿Está seguro que desea eliminar a este conductor de su petición? El usuario será marcado como rechazado')){
      await updateDoc(peticionInteresada, {
        aceptados:arrayRemove(usuario.uid)
      });

      let prueba = await this.fire.getAllPeticiones();

    prueba = prueba.filter((transporte:any) => transporte.id === idPeticion);
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
    await updateDoc(peticionInteresada, {
      rechazados: rechazados
    });

      let actualizaUsuario = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+usuario.uid);

      await updateDoc(actualizaUsuario, {
          peticionesAceptadas: arrayRemove(peticionABorrar)
      })
      location.reload();
    }
  }
}
