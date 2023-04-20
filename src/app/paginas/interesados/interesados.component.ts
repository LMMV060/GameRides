import { Component } from '@angular/core';
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
  ){

  }

  async ngOnInit(){
    this.ofertaDeTransporte = await this.inter.getOferta();

    if(this.ofertaDeTransporte === undefined){
      const datosOferta:any = localStorage.getItem('InteresadosOferta');
      this.ofertaDeTransporte = JSON.parse(datosOferta);

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

  aceptar(uid:any){

  }

  async rechazar(uid:any){
    //this.interesadosMostrar = [];
    let datos=  await this.inter.rechazar(uid, this.ofertaDeTransporte.id);
    //this.interesadosMostrar.push(datos)
  }

}
