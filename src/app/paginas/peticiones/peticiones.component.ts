import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Peticion } from 'src/app/interfaces/peticion';
import { Ofertas } from 'src/app/interfaces/ofertas';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Evento } from 'src/app/interfaces/evento';
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit {
  token = "d469385fa45e0c309e3c176dd5b62f70";


  mostrarContenido = false;

  fecha:any = "";
  VehiculosTotales:any = [];
  misVehiculos:any = [];
  alias:any;
  coche:any;
  eventoSeleccionado:any;
  eventos:any = [];


  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
  ) { }

  Peticiones:any = [];
  Transportes:any = [];

  async ngOnInit() {
    this.getSmashApi();


    //Comprobación de fecha actual
    console.log(this.fecha);

    const unixTime = Math.floor(new Date().getTime() / 1000);
    console.log(unixTime);

    console.log(this.convertirUnixAFecha(unixTime));

    //Vehiculos y alias

    const vehiculos = await getDocs(collection(this.fire.basededatos(), "Coches"));
    vehiculos.forEach((doc) => {

      console.log(doc.data());
      this.VehiculosTotales.push(doc.data());


    });

    this.VehiculosTotales.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.misVehiculos.push(objeto));

    console.log(this.misVehiculos[0].alias);

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

    console.log(event.target.value);
    this.opcionSeleccionada = event.target.value;
  }

  Evento(event:any){

    console.log(event.target.value);
    this.eventoSeleccionado = parseInt(event.target.value);


    const evento:Evento = this.eventos.find((objeto:Evento)  => objeto.id === this.eventoSeleccionado);

    if(evento){
      this.eventoSeleccionado = evento;
      console.log(evento);
      this.fecha = this.convertirUnixAFecha(evento.startAt);



    } else {
      console.log("no");

    }

    //id
  }

  Alias(event:any){

    console.log(event.target.value);
    this.alias = event.target.value;
    this.coche = this.fire.getCocheData(this.alias);
  }

  async realizarPeticion(){
    console.log("Peticion");


    if(this.auth.currentUser && this.auth.currentUser.photoURL && this.auth.currentUser.displayName && this.fecha){
      const pet:Peticion= {
        uid:this.auth.currentUser?.uid,
        url:this.auth.currentUser.photoURL,
        nombre:this.auth.currentUser.displayName,
        fecha: this.fecha,
        precio:20,
        evento: this.eventoSeleccionado || null,
        descripcion:"Quiero ir a este sitio porque me parece la ostia",
      }


      for(let i = 1; i<= 5; i++){
        const docRef = doc(this.fire.basededatos(), "Peticiones", "Peticion-"+ i + "-"+this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 5){
            console.log("Numero máximo de peticiones alcanzadas");
          }
        } else {
          const response = await setDoc(doc(this.fire.basededatos(), "Peticiones", "Peticion-"+ i + "-"+this.auth.currentUser.uid), pet)
          console.log("Peticion creada");
          i = 21;
        }

      }


    } else {
      console.log("Operacion no permitida");

    }



  }

  async ofrecerTransporte(){
    console.log("Transporte");

    if(this.auth.currentUser && this.auth.currentUser.photoURL && this.auth.currentUser.displayName && this.fecha && this.alias != "" && this.alias){
      const pet:Ofertas= {
        uid:this.auth.currentUser?.uid,
        url:this.auth.currentUser.photoURL,
        nombre:this.auth.currentUser.displayName,
        fecha: this.fecha,
        vehiculo: this.alias,
        precio:20,
        evento: this.eventoSeleccionado || null,
        descripcion:"Ofrezco ir a este sitio",
      }


      for(let i = 1; i<= 5; i++){
        const docRef = doc(this.fire.basededatos(), "Transportes", "Transporte-"+ i + "-"+this.auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 5){
            console.log("Numero máximo de transportes alcanzadas");
          }
        } else {
          const response = await setDoc(doc(this.fire.basededatos(), "Transportes", "Transporte-"+ i + "-"+this.auth.currentUser.uid), pet)
          console.log("Transporte creada");
          i = 21;
        }

      }


    } else {
      console.log("Operacion no permitida");

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
    console.log('Valor del input:', fecha);
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

        console.log(this.eventos);


      })
      .catch(error => console.error(error));


  }
}

