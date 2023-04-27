import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CocheService } from 'src/app/servicios/coche.service';
import { Auth } from '@angular/fire/auth';
import { TransporteService } from 'src/app/servicios/transporte.service';

@Component({
  selector: 'app-editar-oferta',
  templateUrl: './editar-oferta.component.html',
  styleUrls: ['./editar-oferta.component.css']
})
export class EditarOfertaComponent {
  token = "d469385fa45e0c309e3c176dd5b62f70";
  eventos:any = [];
  coches:any = [];
  unixTime:any;
  transporteAEditar:any;

  fecha:any
  descripcion:any
  eventoEditarNombre:any
  cocheActual:any
  cocheId:any;
  torneoEditar:any = []
  precioEditar:any;
  constructor(
    private transporte: TransporteService,
    private coche: CocheService,
    private router: Router,
    private auth: Auth,
  ) {

  }

  async ngOnInit(){
    try{

      this.unixTime = Math.floor(new Date().getTime() / 1000);
      this.getSmashApi();

      this.transporteAEditar = this.transporte.getTransporte();
      this.coches = await this.coche.getCochesByUid(this.auth.currentUser?.uid)
      if(this.transporteAEditar === undefined){
        const datosOferta:any = localStorage.getItem('DatosOferta');
        this.transporteAEditar = JSON.parse(datosOferta);

      } else {
        localStorage.setItem('DatosOferta', JSON.stringify(this.transporteAEditar));

      }

      this.cocheActual = await this.coche.getCocheByID(this.transporteAEditar.vehiculo);
      this.cocheId = this.cocheActual.id;
      if(this.transporteAEditar.evento){
        this.eventoEditarNombre = this.transporteAEditar.evento.name;
      }
      this.torneoEditar.push(this.transporteAEditar.evento);
      this.fecha = this.transporteAEditar.fecha;
      this.descripcion = this.transporteAEditar.descripcion;
      this.precioEditar = this.transporteAEditar.precio;

    } catch(err){
      this.router.navigateByUrl("/error")
    }




  }

  logEventos(event:any) {
    const id = event.target.value;
    this.torneoEditar = this.eventos.filter((evento:any) => evento.id == id)
    this.eventoEditarNombre = this.torneoEditar[0].name;
    this.fecha = this.convertirUnixAFecha(this.torneoEditar[0].startAt);


  }


  logCoches(event:any) {
    const id = event.target.value;

    this.cocheId = id;

  }

  guardarEdicion(id:any){

    this.transporte.actualizarTransporte(id, this.fecha, this.torneoEditar[0], this.precioEditar , this.descripcion, this.cocheId);
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
