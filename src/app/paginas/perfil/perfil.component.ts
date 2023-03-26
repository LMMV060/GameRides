import { Router } from '@angular/router';
import { FirebaseService } from './../../servicios/firebase.service';
import { initializeApp } from '@angular/fire/app';
import { Auth, getAuth, updateProfile } from '@angular/fire/auth';
import { Component, OnInit, } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs } from '@angular/fire/firestore';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario:any = [];
  public nombre = this.auth.currentUser?.displayName;
  public img:any = this.auth.currentUser?.photoURL;

  Peticiones:any = [];
  PeticionesUsuario:any = [];

  Transportes:any = [];
  TransportesUsuario:any = [];
  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.auth.currentUser?.uid);

    const docRef = doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser?.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.usuario.push(docSnap.data())
      this.img = this.usuario[0].imgUrl
      if(this.auth.currentUser && this.auth.currentUser?.photoURL != this.usuario[0].imgUrl){
        updateProfile(this.auth.currentUser, {
          photoURL: this.usuario[0].imgUrl
        })
      } else {

      }
    }

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {
      this.Peticiones.push(doc.data());
    });

    this.Peticiones.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.PeticionesUsuario.push(objeto));

    const queryTransporte = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    queryTransporte.forEach((doc) => {
      this.Transportes.push(doc.data());
    });

    this.Transportes.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.TransportesUsuario.push(objeto));


  }



  Editar(){
  }

  loading = true;

  onImageLoad() {
    this.loading = false;
  }

  hovered = false;

  setHovered(valor:boolean){
    this.hovered = valor;
  }

  async eliminarPeticion(peticion:any){
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {

    });

    console.log(peticion);

    if (confirm('¿Está seguro de que desea eliminar este elemento?')) {


      await deleteDoc(doc(this.fire.basededatos(), "Peticiones", peticion));

      this.PeticionesUsuario = this.PeticionesUsuario.filter((o:any) => o !== peticion);
      console.log("Objeto eliminado:", peticion);
    }



  }

  async eliminarOferta(peticion:any){
    
  }

  opcionSeleccionada:any = "Pasajeros";

  Busqueda(event:any){

    console.log(event.target.value);
    this.opcionSeleccionada = event.target.value;
  }
}
