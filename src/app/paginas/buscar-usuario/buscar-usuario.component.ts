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

  currentUsersIndx = 0;
  usersPerPage = 3;

  constructor(
    private fire:FirebaseService,
    private router:Router,
    private auth:Auth,
  ) { }

  async ngOnInit() {
    await this.Mostrar();
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
  }

  async Mostrar(){
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      this.datos.push(doc.data());

    });

    this.datosFiltrados = this.datos;

    await this.ordenarUsuarios();

  }

  async irAPerfil(id:string){
    if(id == this.auth.currentUser?.uid){
      this.router.navigateByUrl("/perfil")
    } else {
      let usuarioClick:any = this.datos.find((item: { uid: any; }) => item.uid === id);
      localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

      this.router.navigate(["/perfil", usuarioClick.nombre])
    }
  }

  ordenarUsuarios() {
    this.datosFiltrados.sort((usuario1:any, usuario2:any) => {

      // Comparar calificaciones medias
      const calificacion1 = usuario1.calificacionMedia;
      const calificacion2 = usuario2.calificacionMedia;
      if (calificacion2 && calificacion1 !== calificacion2) {
        return calificacion2 - calificacion1; // Orden descendente por calificación media
      }

      // Si las calificaciones son iguales o uno de los usuarios no tiene calificación, comparar por orden alfabético
      const nombre1Min = usuario1.nombre.toLowerCase();
      const nombre2Min = usuario2.nombre.toLowerCase();
      return nombre1Min.localeCompare(nombre2Min);

    }).sort((usuario1:any, usuario2:any) => {

      // Mover usuarios sin calificación al final del array
      const tieneCalificacion1 = usuario1.calificacionMedia !== undefined;
      const tieneCalificacion2 = usuario2.calificacionMedia !== undefined;
      if (tieneCalificacion1 === tieneCalificacion2) {
        return 0; // Ambos tienen o no tienen calificación
      }
      return tieneCalificacion1 ? -1 : 1; // Mover usuarios sin calificación al final

    });
  }

  canGoBack() {
    return this.currentUsersIndx > 0;
  }

  canGoForward() {
    return this.currentUsersIndx + this.usersPerPage < this.datosFiltrados.length;
  }

  onBack(): void {
    if (this.canGoBack()) {
      this.currentUsersIndx -= this.usersPerPage;
    }
  }

  onForward(): void {
    if (this.canGoForward()) {
      this.currentUsersIndx += this.usersPerPage;
    }
  }


}
