import { Usuarios } from 'src/app/interfaces/usuarios';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-perfil-ajeno',
  templateUrl: './perfil-ajeno.component.html',
  styleUrls: ['./perfil-ajeno.component.css']
})
export class PerfilAjenoComponent implements OnInit {

  nombre: string= "";
  usuarioActual:any;
  Peticiones:any = [];
  PeticionesUsuario:any = [];
  Transportes:any = [];
  TransportesUsuario:any = [];
  isBan:boolean = false;

  cargaPerfil:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
    ) { }

    datos:any = [];

  async ngOnInit() {
    this.nombre = this.route.snapshot.paramMap.get('nombre') || "";
    console.log(this.nombre);

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      this.datos.push(doc.data());
    });

    this.usuarioActual = this.datos.filter((objeto:any) => objeto.nombre === this.nombre);

    this.isBan = this.usuarioActual[0].isDisabled
    const queryPeticiones = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    queryPeticiones.forEach((doc) => {
      this.Peticiones.push(doc.data());
    });

    this.Peticiones.filter((objeto:any) => objeto.uid == this.usuarioActual[0].uid).forEach((objeto: any) => this.PeticionesUsuario.push(objeto));

    const queryTransporte = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    queryTransporte.forEach((doc) => {
      this.Transportes.push(doc.data());
    });

    this.Transportes.filter((objeto:any) => objeto.uid == this.usuarioActual[0].uid).forEach((objeto: any) => this.TransportesUsuario.push(objeto));



    if(this.usuarioActual.length === 0){
      this.router.navigateByUrl('/error');
    }

    if(this.usuarioActual.length === 1){
      if(this.auth.currentUser?.uid === this.usuarioActual[0].uid) {
        this.router.navigateByUrl("/perfil");
      } else {
        this.cargaPerfil = true;
      }
    }

  }

  opcionSeleccionada:any = "Pasajeros";

  Busqueda(event:any){

    this.opcionSeleccionada = event.target.value;
  }

}
