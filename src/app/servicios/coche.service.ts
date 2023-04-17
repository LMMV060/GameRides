import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CocheService {

  Coche: any;

  constructor(
    private fire: FirebaseService,
    private router: Router
  ) { }

  setCoche(Coche: any) {
    this.Coche = Coche;
  }

  getCoche() {
    return this.Coche;
  }

  async guardarNuevoCoche(id:any, alias:any, matricula:any, plazas:any){
    const ofertas = await this.fire.getAllTransportes();
    let ofertasConElCoche:any = [];
    let cocheEditar = await doc(this.fire.basededatos(), "Coches", id);

    await updateDoc(cocheEditar, {
      alias: alias,
      matricula: matricula,
      plazas: plazas
    });

    //Esta parte en verdad es innecesaria lmaoooo
    ofertasConElCoche = ofertas.filter((oferta:any) => oferta.vehiculo === id);

    ofertasConElCoche.forEach(async (oferta:any) => {
      let transporteEditar = await doc(this.fire.basededatos(), "Transportes", oferta.id);

      await updateDoc(transporteEditar, {
        vehiculo: id
      })
    });

    this.router.navigateByUrl("/coches")
  }

  async borrarCoche(id:any){
    const ofertas = await this.fire.getAllTransportes();
    let ofertasConElCoche:any = [];

    let cocheBorrar = await doc(this.fire.basededatos(), "Coches", id);

    if (confirm('¿Está seguro de que desea eliminar este coche? Todas las ofertas de transporte con este coche serán borradas')) {

      ofertasConElCoche = ofertas.filter((oferta:any) => oferta.vehiculo === id);

      ofertasConElCoche.forEach(async (oferta:any) => {
        let transporteBorrar = await doc(this.fire.basededatos(), "Transportes", oferta.id);
        await deleteDoc(transporteBorrar)
      });

      await deleteDoc(cocheBorrar)
      location.reload();
    }
  }

  async getCocheByID(id:any){
    let coche:any = [];
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Coches"));
    querySnapshot.forEach((doc) => {
      coche.push(doc.data());
    });

    coche = coche.filter((coche:any) => coche.id === id);

    return coche[0];
  }

  async getCochesByUid(uid:any){
    let coches:any = [];
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Coches"));
    querySnapshot.forEach((doc) => {
      coches.push(doc.data());
    });

    coches = coches.filter((coche:any) => coche.uid === uid);

    return coches;
  }
}
