import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CocheService } from 'src/app/servicios/coche.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { InteresadosService } from 'src/app/servicios/interesados.service';

@Component({
  selector: 'app-interesados',
  templateUrl: './interesados.component.html',
  styleUrls: ['./interesados.component.css']
})
export class InteresadosComponent {

  ofertaDeTransporte:any;

  interesados:any;
  interesadosMostrar:any = [];

  aceptados:any = [];
  aceptadosMostrar:any = [];

  vehiculo:any;

  constructor(
    private inter: InteresadosService,
    private router:Router,
    private auth: Auth,
    private coche: CocheService,
    private fire:FirebaseService
  ){

  }

  async ngOnInit(){
    this.ofertaDeTransporte = await this.inter.getOferta();


    if(this.ofertaDeTransporte === undefined){
      const datosOferta:any = localStorage.getItem('InteresadosOferta');
      this.ofertaDeTransporte = JSON.parse(datosOferta);
      let prueba:any = await this.inter.actualizarOferta(this.ofertaDeTransporte.id);

      this.ofertaDeTransporte = prueba;

    } else {
      localStorage.setItem('InteresadosOferta', JSON.stringify(this.ofertaDeTransporte));
    }

    this.interesados = this.ofertaDeTransporte.interesados;
    if(this.interesados){
      this.interesados.forEach(async (objeto:any) => {
        const dato = await this.inter.getInteresados(objeto)
        this.interesadosMostrar.push(dato);
      });
    }

    this.aceptados = this.ofertaDeTransporte.aceptados;

    if(this.aceptados){
      this.aceptados.forEach(async (uid:any) => {
        let dato = await this.inter.getAceptados(uid);
        this.aceptadosMostrar.push(dato);
      });
    }

    this.vehiculo = await this.coche.getCocheByID(this.ofertaDeTransporte.vehiculo)

  }

  irAPerfil(id:any){
    let usuarioClick:any = this.interesadosMostrar.find((item: { uid: any; }) => item.uid === id);
    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }

  async irAPerfilAceptado(uid:any){
    let usuarioClick:any = await this.fire.getUserByUID(uid);

    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }

  async aceptar(uid:any){
    if(this.ofertaDeTransporte.aceptados != undefined && this.ofertaDeTransporte.aceptados.length +1 >= this.vehiculo.plazas) {
      alert("Actualmente tienes " + (this.ofertaDeTransporte.aceptados.length +1) + " de " + this.vehiculo.plazas + " plazas llenas, si quieres aceptar a este usuario, rechaza uno de los aceptados o aumenta el número de plazas de tu vehículo")
    } else {
      await this.inter.aceptar(uid, this.ofertaDeTransporte.id);
    let prueba:any = await this.inter.actualizarOferta(this.ofertaDeTransporte.id);

    this.ofertaDeTransporte = prueba;
    localStorage.setItem('InteresadosOferta', JSON.stringify(this.ofertaDeTransporte));
    this.interesados = this.ofertaDeTransporte.interesados;
    this.interesadosMostrar = [];
    if(this.interesados){
      this.interesados.forEach(async (objeto:any) => {
        const dato = await this.inter.getInteresados(objeto)
        this.interesadosMostrar.push(dato);
      });
    }

    this.aceptados = this.ofertaDeTransporte.aceptados;
    this.aceptadosMostrar = [];
    if(this.aceptados) {
    this.aceptados.forEach(async (uid:any) => {
      let dato = await this.inter.getAceptados(uid);
      this.aceptadosMostrar.push(dato);
    });
    }
    }


  }

  async rechazar(uid:any){
    //this.interesadosMostrar = [];
    await this.inter.rechazar(uid, this.ofertaDeTransporte.id);
    let prueba:any = await this.inter.actualizarOferta(this.ofertaDeTransporte.id);

    this.ofertaDeTransporte = prueba;
    localStorage.setItem('InteresadosOferta', JSON.stringify(this.ofertaDeTransporte));
    this.interesados = this.ofertaDeTransporte.interesados;
    this.interesadosMostrar = [];
    this.interesados.forEach(async (objeto:any) => {
      const dato = await this.inter.getInteresados(objeto)
      this.interesadosMostrar.push(dato);
    });
  }

  async quitar(uid:any){
    this.inter.eliminarAceptado(uid, this.ofertaDeTransporte.id)
  }

}
