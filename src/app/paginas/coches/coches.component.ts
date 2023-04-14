import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
@Component({
  selector: 'app-coches',
  templateUrl: './coches.component.html',
  styleUrls: ['./coches.component.css']
})
export class CochesComponent implements OnInit {

  matricula:any;
  alias:any;
  plazas:any;

  misVehiculos:any = [];
  VehiculosTotales:any = [];
  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
  ) { }

  async ngOnInit(): Promise<void> {
    //const response = await setDoc(doc(this.fire.basededatos(), "Peticiones", "Peticion-"+ i + "-"+this.auth.currentUser.uid), pet)

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Coches"));
    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      this.VehiculosTotales.push(doc.data());
    });

    this.VehiculosTotales.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.misVehiculos.push(objeto));

  }

  ObtenerMatricula(event:any){
    const mat = event.target.value;
    //console.log('Matricula:', mat);
    this.matricula = mat;
  }

  ObtenerAlias(event:any){
    const alias = event.target.value;
    //console.log('Alias:', alias);
    this.alias = alias;
  }

  ObtenerPlazas(event:any){
    const plazas = event.target.value;
    //console.log('Alias:', alias);
    this.plazas = plazas;
  }

  async SubirCoche(){
    if (/^[0-9]{4}\s[A-Z]{3}$/.test(this.matricula)) {
      //console.log('La matrícula es correcta');
      if(this.auth.currentUser){
        const vehiculo:Vehiculo = {
          matricula: this.matricula,
          alias:this.alias,
          uid: this.auth.currentUser.uid,
          plazas: this.plazas
        }

        for(let i = 1; i<= 3; i++){
          const docRef = doc(this.fire.basededatos(), "Coches", "Coche-"+ i + "-"+this.auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            if(i == 3){
              console.log("Numero máximo de vehiculos alcanzadas");
            }
          } else {
            const response = await setDoc(doc(this.fire.basededatos(), "Coches", "Coche-"+ i + "-"+this.auth.currentUser.uid), vehiculo)
            //console.log("Coche creado");
            location.reload();
            i = 21;
          }
        }
      }


      } else {
      alert('La matrícula no cumple el formato "0000 ABC"');
      }
  }
}
