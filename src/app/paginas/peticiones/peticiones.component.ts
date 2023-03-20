import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, setDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  opcionSeleccionada:any = "Conductores";

  Busqueda(event:any){

    console.log(event.target.value);

  }


}
