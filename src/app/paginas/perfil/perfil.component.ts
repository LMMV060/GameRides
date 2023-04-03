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

  isAdmin:boolean = false;
  usuario:any = [];
  public nombre:any = this.auth.currentUser?.displayName;
  public img:any = this.auth.currentUser?.photoURL;

  Peticiones:any = [];
  PeticionesUsuario:any = [];

  Transportes:any = [];
  TransportesUsuario:any = [];

  Noticias:any = [];
  NoticiasUsuario:any = [];

  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  async ngOnInit(): Promise<void> {
    try{
      const usuarioActual = await this.fire.getCurrentUser();

    //this.isAdmin = true;

    console.log(this.auth.currentUser?.uid);

    const docRef = doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser?.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.usuario.push(docSnap.data())
      this.img = this.usuario[0].imgUrl
      this.nombre = this.usuario[0].nombre
      this.isAdmin = this.usuario[0].isAdmin;
      if(this.auth.currentUser){
        updateProfile(this.auth.currentUser, {
          displayName: this.usuario[0].nombre,
          photoURL: this.usuario[0].imgUrl
        })
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

    const queryNoticias = await getDocs(collection(this.fire.basededatos(), "Noticias"));
    queryNoticias.forEach((doc) => {
      this.Noticias.push(doc.data());
    });

    this.Noticias.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.NoticiasUsuario.push(objeto));


    } catch(err){
      console.log(err);

    }


  }



  Editar(){
  }

  loading = true;

  onImageLoad() {
    this.loading = false;
  }

  async eliminarPeticion(peticion:any){

    if (confirm('¿Está seguro de que desea eliminar esta petición?')) {

      await deleteDoc(doc(this.fire.basededatos(), "Peticiones", peticion.id));

      this.PeticionesUsuario = this.PeticionesUsuario.filter((o:any) => o !== peticion);
      console.log("Objeto eliminado:", peticion);
    }



  }

  async eliminarOferta(peticion:any){
    if (confirm('¿Está seguro de que desea eliminar esta oferta?')) {

      await deleteDoc(doc(this.fire.basededatos(), "Transportes", peticion.id));

      this.TransportesUsuario = this.TransportesUsuario.filter((o:any) => o !== peticion);
      console.log("Objeto eliminado:", peticion);
    }
  }

  opcionSeleccionada:any = "Pasajeros";

  Busqueda(event:any){

    console.log(event.target.value);
    this.opcionSeleccionada = event.target.value;
  }

  irADashboard(){
    this.router.navigateByUrl("/dashboard");
  }
}
