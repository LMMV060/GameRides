import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InteresadosPeticionService } from 'src/app/servicios/interesados-peticion.service';

@Component({
  selector: 'app-interesados-peticion',
  templateUrl: './interesados-peticion.component.html',
  styleUrls: ['./interesados-peticion.component.css']
})
export class InteresadosPeticionComponent {

  peticion:any;
  interesados:any;
  interesadosMostrar:any = [];


  constructor(
    private interP:InteresadosPeticionService,
    private router:Router,
  ){

  }

  async ngOnInit() {
    this.peticion = await this.interP.getPeticion()

    if(this.peticion === undefined){
      const datosPeticion:any = localStorage.getItem('InteresadosPeticion');
      this.peticion = JSON.parse(datosPeticion);

      //this.peticion = prueba;

    } else {
      localStorage.setItem('InteresadosPeticion', JSON.stringify(this.peticion));
    }

    console.log(this.peticion);

    this.interesados = this.peticion.interesados;
    if(this.interesados){
      this.interesados.forEach(async (objeto:any) => {
        const dato = await this.interP.getInteresados(objeto)
        this.interesadosMostrar.push(dato);
      });
    }

  }

  irAPerfil(id:any){
    let usuarioClick:any = this.interesadosMostrar.find((item: { uid: any; }) => item.uid === id);
    console.log(usuarioClick);
    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }

  async aceptar(uid:any){

  }

  async rechazar(uid:any){

  }
}
