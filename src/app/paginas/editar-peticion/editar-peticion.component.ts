import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionService } from 'src/app/servicios/peticion.service';

@Component({
  selector: 'app-editar-peticion',
  templateUrl: './editar-peticion.component.html',
  styleUrls: ['./editar-peticion.component.css']
})
export class EditarPeticionComponent {
  token = "d469385fa45e0c309e3c176dd5b62f70";
  eventos:any = [];
  unixTime:any;
  peticionEditar:any;


  eventoEditarNombre:any;
  fechaEditar:any;
  descripcionEditar:any;
  torneoEditar:any = [];
  precioEditar:any;
  constructor(
    private p:PeticionService,
    private router: Router
  ){


  }
  async ngOnInit() {
    this.unixTime = Math.floor(new Date().getTime() / 1000);
    this.getSmashApi();
    this.peticionEditar = await this.p.getPeticion();

    if(this.peticionEditar === undefined){
      const datosOferta:any = localStorage.getItem('DatosPeticion');
      this.peticionEditar = JSON.parse(datosOferta);

    } else {
      localStorage.setItem('DatosPeticion', JSON.stringify(this.peticionEditar));
    }
    this.fechaEditar = this.peticionEditar.fecha;
    this.eventoEditarNombre = this.peticionEditar.evento.name;
    this.torneoEditar.push(this.peticionEditar.evento);
    this.descripcionEditar = this.peticionEditar.descripcion;
    this.precioEditar = this.peticionEditar.precio;
    console.log(this.peticionEditar);
  }

  logFechaDeIda(event:any){
    //console.log('Fecha de ida:', event.target.value);
    this.fechaEditar = event.target.value;
  }

  logEventos(event:any) {
    const id = event.target.value;
    this.torneoEditar = this.eventos.filter((evento:any) => evento.id == id)
    this.eventoEditarNombre = this.torneoEditar[0].name;
    this.fechaEditar = this.convertirUnixAFecha(this.torneoEditar[0].startAt);
  }

  guardarEdicion(id:any){
    this.p.guardarNuevaPeticion(id, this.fechaEditar, this.torneoEditar[0], this.precioEditar,this.descripcionEditar);

    this.router.navigateByUrl("/perfil")
  }

  getSmashApi(){
    const query = `query TournamentsByCountry($cCode: String!, $perPage: Int!) {
      tournaments(query: {
        perPage: $perPage
        filter: {
          countryCode: $cCode
        }
      }) {
        nodes {
          id
          name
          countryCode
          venueAddress
          images{
            url
          }
          startAt
          endAt
          timezone
          city
          registrationClosesAt
          postalCode
          primaryContact
        }
      }
    }`;

    const variables = {
      cCode: 'ES',
      perPage: 100
    };

    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
      .then(response => response.json())
      .then(async data => {
        this.eventos = await data.data.tournaments.nodes;

        this.eventos = this.eventos.filter((evento:any) => evento.endAt > this.unixTime)

      })
      .catch(error => console.error(error));
  }

  convertirUnixAFecha(unix:number) {
    const fecha = new Date(unix * 1000);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

}
