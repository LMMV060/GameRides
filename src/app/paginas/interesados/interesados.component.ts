import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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

  constructor(
    private inter: InteresadosService,
    private router:Router,
    private auth: Auth,
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
    this.interesados.forEach(async (objeto:any) => {
      const dato = await this.inter.getInteresados(objeto)
      this.interesadosMostrar.push(dato);
    });
  }

  irAPerfil(id:any){
    let usuarioClick:any = this.interesadosMostrar.find((item: { uid: any; }) => item.uid === id);
    console.log(usuarioClick);
    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }

  async aceptar(uid:any){
    await this.inter.aceptar(uid, this.ofertaDeTransporte.id);
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

}
