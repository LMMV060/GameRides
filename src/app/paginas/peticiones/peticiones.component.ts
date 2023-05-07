import { TransporteService } from './../../servicios/transporte.service';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Peticion } from 'src/app/interfaces/peticion';
import { Ofertas } from 'src/app/interfaces/ofertas';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Evento } from 'src/app/interfaces/evento';
import { PeticionService } from 'src/app/servicios/peticion.service';
import { SmashAPIService } from 'src/app/servicios/smash-api.service';
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit {
  token = "d469385fa45e0c309e3c176dd5b62f70";
  unixTime:any;

  mostrarContenido = false;

  fecha:any = "";
  VehiculosTotales:any = [];
  misVehiculos:any = [];
  alias:any;
  coche:any;
  precio:any;
  eventoSeleccionado:any;
  eventos:any = [];
  descripcion:any;
  tituloAlternativo:any;
  descripcionAlternativa:any;


  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
    private transporte:TransporteService,
    private peticion: PeticionService,
  ) { }

  Peticiones:any = [];
  Transportes:any = [];

  async ngOnInit() {
    this.unixTime = Math.floor(new Date().getTime() / 1000);
    this.getSmashApi();


    //Comprobación de fecha actual

    const unixTime = Math.floor(new Date().getTime() / 1000);

    //Vehiculos y alias

    const vehiculos = await getDocs(collection(this.fire.basededatos(), "Coches"));
    vehiculos.forEach((doc) => {

      this.VehiculosTotales.push(doc.data());


    });

    this.VehiculosTotales.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.misVehiculos.push(objeto));

    //this.alias = this.misVehiculos[0].alias;

    //Mostrar ofertas y peticiones
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {

      this.Peticiones.push(doc.data());

      this.Peticiones.sort(() => Math.random() - 0.5);

    });

    const querySnapshotTransporte = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    querySnapshotTransporte.forEach((doc) => {

      this.Transportes.push(doc.data());

      this.Transportes.sort(() => Math.random() - 0.5);

    });
  }

  opcionSeleccionada:any = "Conductores";

  Busqueda(event:any){
    this.opcionSeleccionada = event.target.value;
  }

  Evento(event:any){
    this.eventoSeleccionado = parseInt(event.target.value);


    const evento:Evento = this.eventos.find((objeto:Evento)  => objeto.id === this.eventoSeleccionado);

    if(evento){
      this.eventoSeleccionado = evento;
      this.fecha = this.convertirUnixAFecha(evento.startAt);

    } else {

    }

    //id
  }

  Alias(event:any){
    this.alias = event.target.value;
    this.coche = this.fire.getCocheData(this.alias);
  }

  async realizarPeticion(){

    if(this.auth.currentUser && this.auth.currentUser.photoURL && this.auth.currentUser.displayName && this.fecha && this.precio){

      for(let i = 1; i<= 5; i++){
        const docRef = doc(this.fire.basededatos(), "Peticiones", "Peticion-"+ i + "-"+this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 5){
            alert("Numero máximo de peticiones alcanzadas");
          }
        } else {
          const real:any = await this.fire.getUserDataReal();
          if(this.eventoSeleccionado){
            this.tituloAlternativo = null;
            this.descripcionAlternativa = null;
          }
          const pet:Peticion= {
            id: "Peticion-"+ i + "-"+this.auth.currentUser.uid,
            uid:this.auth.currentUser?.uid,
            url: real.imgUrl,
            nombre:real.nombre,
            fecha: this.fecha,
            precio: this.precio,
            evento: this.eventoSeleccionado || null,
            descripcion: this.descripcion,
            email: this.auth.currentUser?.email,
            tituloAlternativo:this.tituloAlternativo,
            descripcionAlternativa:this.descripcionAlternativa
          }

          const response = await setDoc(doc(this.fire.basededatos(), "Peticiones", "Peticion-"+ i + "-"+this.auth.currentUser.uid), pet)
          alert("Peticion de transporte creada");
          location.reload();
          i = 21;
        }
      }

    } else {
      alert("Faltan datos necesarios");

    }



  }

  async ofrecerTransporte(){

    if(this.auth.currentUser && this.auth.currentUser.photoURL && this.auth.currentUser.displayName && this.fecha && this.alias != "" && this.alias && this.precio){

      for(let i = 1; i<= 5; i++){
        const docRef = doc(this.fire.basededatos(), "Transportes", "Transporte-"+ i + "-"+this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 5){
            alert("Numero máximo de transportes alcanzadas");
          }
        } else {
          const real:any = await this.fire.getUserDataReal();
          if(this.eventoSeleccionado){
            this.tituloAlternativo = null;
            this.descripcionAlternativa = null;
          }

          const pet:Ofertas= {
            id: "Transporte-"+ i + "-"+this.auth.currentUser.uid,
            uid:this.auth.currentUser?.uid,
            url:real.imgUrl,
            nombre: real.nombre,
            fecha: this.fecha,
            vehiculo: this.alias,
            precio: this.precio,
            evento: this.eventoSeleccionado || null,
            descripcion: this.descripcion,
            email: this.auth.currentUser?.email,
            tituloAlternativo:this.tituloAlternativo,
            descripcionAlternativa:this.descripcionAlternativa
          }

          const response = await setDoc(doc(this.fire.basededatos(), "Transportes", "Transporte-"+ i + "-"+this.auth.currentUser.uid), pet)
          alert("Has creado la oferta de transporte");
          location.reload();
          i = 21;
        }
      }


    } else {
      alert("Faltan datos necesarios");
    }

  }



   convertirUnixAFecha(unix:number) {
    const fecha = new Date(unix * 1000);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  ObtenerFecha(event:any){
    const fecha = event.target.value;
    this.fecha = fecha;
  }

  getSmashApi(){
    const query = `query TournamentsByCountry($cCode: String!, $perPage: Int!) {
      tournaments(query: {
        perPage: $perPage
        filter: {
          countryCode: $cCode
        }
      }) {
        nodes {
          id
          name
          countryCode
          venueAddress
          images{
            url
          }
          startAt
          endAt
          timezone
          city
          registrationClosesAt
          postalCode
          primaryContact
        }
      }
    }`;

    const variables = {
      cCode: 'ES',
      perPage: 100
    };

    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
      .then(response => response.json())
      .then(async data => {
        this.eventos = await data.data.tournaments.nodes;

        this.eventos = this.eventos.filter((evento:any) => evento.endAt > this.unixTime)


      })
      .catch(error => console.error(error));

  }

  async irAPerfil(nombre:any){

    const usuarioActual:any = await this.fire.getUserDataReal();

    if(usuarioActual.nombre === nombre){
      this.router.navigateByUrl("/perfil");
    } else {
      this.router.navigateByUrl("/perfil/"+nombre);
    }

  }

  verDatosTransporte(transporte:any){
    if(transporte.uid === this.auth.currentUser?.uid){
      this.transporte.setTransporte(transporte);
      this.router.navigateByUrl("/editar-oferta")
    } else{
      this.transporte.setTransporte(transporte);
      this.router.navigateByUrl("/ofertasTransportes")
    }
  }

  verDatosPeticion(peticion:any){
    if(peticion.uid === this.auth.currentUser?.uid){
      this.peticion.setPeticion(peticion);
      this.router.navigateByUrl("/editar-peticion")
    } else{
      this.peticion.setPeticion(peticion);
      this.router.navigateByUrl("/solicitudesPeticiones")
    }
  }

  //Pasar paginas para las ofertas

  currentPageIndexOfertas = 0;
  ofertasPerPage = 4;

  canGoBackO() {
    return this.currentPageIndexOfertas > 0;
  }

  canGoForwardO() {
    return this.currentPageIndexOfertas + this.ofertasPerPage < this.Transportes.length;
  }

  onBackO(): void {
    if (this.canGoBackO()) {
      this.currentPageIndexOfertas -= this.ofertasPerPage;
    }
  }

  onForwardO(): void {
    if (this.canGoForwardO()) {
      this.currentPageIndexOfertas += this.ofertasPerPage;
    }
  }

  currentPageIndexPeticiones= 0;
  peticionesPerPage = 4;

  canGoBackP() {
    return this.currentPageIndexPeticiones > 0;
  }

  canGoForwardP() {
    return this.currentPageIndexPeticiones + this.peticionesPerPage < this.Peticiones.length;
  }

  onBackP(): void {
    if (this.canGoBackP()) {
      this.currentPageIndexPeticiones -= this.peticionesPerPage;
    }
  }

  onForwardP(): void {
    if (this.canGoForwardP()) {
      this.currentPageIndexPeticiones += this.peticionesPerPage;
    }
  }
}

