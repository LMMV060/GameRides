import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
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
  conductorAceptado:any;


  constructor(
    private interP:InteresadosPeticionService,
    private router:Router,
    private fire: FirebaseService
  ){

  }

  async ngOnInit() {
    this.peticion = await this.interP.getPeticion()

    if(this.peticion === undefined){
      const datosPeticion:any = localStorage.getItem('InteresadosPeticion');
      this.peticion = JSON.parse(datosPeticion);
      let prueba:any = await this.interP.actualizarPeticion(this.peticion.id)

      this.peticion = prueba;
    } else {
      localStorage.setItem('InteresadosPeticion', JSON.stringify(this.peticion));
    }


    this.interesados = this.peticion.interesados;

    this.conductorAceptado = await this.interP.getConductor(this.peticion.id)



    if(this.interesados){
      this.interesados.forEach(async (objeto:any) => {
        const dato = await this.interP.getInteresados(objeto)
        if(dato != undefined){
          this.interesadosMostrar.push(dato);
        }
      });
    }


  }

  async irAPerfil(uid:any){
    let usuarioClick:any = await this.interesadosMostrar.find((item:any) => item.uid === uid);
    console.log(usuarioClick);

    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }

  async aceptar(uid:any){
    if(this.conductorAceptado){
      alert("Ya tienes un conductor aceptado, si quieres otro, deberás quitar el que ya tienes")
    } else {
      await this.interP.aceptar(uid, this.peticion.id).then(async () => {
        let prueba:any = await this.interP.actualizarPeticion(this.peticion.id);
        this.peticion = prueba;
        localStorage.setItem('InteresadosPeticion', JSON.stringify(this.peticion));
        this.interesados = this.peticion.interesados;
        this.interesadosMostrar = [];
        if(this.interesados){
          this.interesados.forEach(async (objeto:any) => {
            const dato = await this.interP.getInteresados(objeto)
            this.interesadosMostrar.push(dato);
          });
        }

        alert("Conductor aceptado")
        location.reload();
      })
    }

  }

  async rechazar(uid:any){
    await this.interP.rechazar(uid, this.peticion.id) .then(async () => {
      let prueba:any = await this.interP.actualizarPeticion(this.peticion.id);
      this.peticion = prueba;
      localStorage.setItem('InteresadosPeticion', JSON.stringify(this.peticion));
      this.interesados = this.peticion.interesados;
      this.interesadosMostrar = [];
      if(this.interesados){
        this.interesados.forEach(async (objeto:any) => {
          const dato = await this.interP.getInteresados(objeto)
          this.interesadosMostrar.push(dato);
        });
      }

      alert("Conductor rechazado")
    })

  }

  quitar(uid:any){
    this.interP.borrarConductor(uid, this.peticion.id)
  }

  async irAPerfilConductor(uid:any){
    let usuarioClick:any = await this.fire.getUserByUID(uid);

    localStorage.setItem('UsuarioAjeno',usuarioClick.uid)

    this.router.navigate(["/perfil", usuarioClick.nombre])
  }
}
