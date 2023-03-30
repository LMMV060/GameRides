import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css']
})
export class BuscarUsuarioComponent implements OnInit {

  datos:any = [];
  datosFiltrados:any = [];

  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
  ) { }

  ngOnInit(): void {
    this.Mostrar();
  }

  ObtenerNombre(event:any){
    const text = event.target.value;
    if (text && text.trim() !== '') {
      this.datosFiltrados = this.datos.filter((item:Usuarios) => {
          return (item.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }else {
      this.datosFiltrados = this.datos;
    }
    console.log(text)
    console.log(this.datosFiltrados)
  }

  async Mostrar(){



    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      console.log(doc.data());
      this.datos.push(doc.data());

    });

    this.datosFiltrados = this.datos;


    console.log(this.datos);


  }

  async irAPerfil(id:string){
    if(id == this.auth.currentUser?.uid){
      this.router.navigateByUrl("/perfil")
    } else {
      let usuarioClick:any = this.datos.find((item: { uid: any; }) => item.uid === id);
      console.log(usuarioClick);
      localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

      this.router.navigate(["/perfil", usuarioClick.nombre])
    }
  }

}
