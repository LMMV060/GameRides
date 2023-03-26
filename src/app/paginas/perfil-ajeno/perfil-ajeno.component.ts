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

    console.log(this.datos);


  }

  

}
