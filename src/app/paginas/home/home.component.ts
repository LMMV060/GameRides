import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Component, OnInit } from '@angular/core';
import { SmashAPIService } from 'src/app/servicios/smash-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  token = "d469385fa45e0c309e3c176dd5b62f70";

  torneos:any = [];
  noticias:any = [];
  unixTime:any;

  constructor(
    private fire: FirebaseService,
    private smash: SmashAPIService,
    private router:Router,
  ){

  }

  async ngOnInit() {
    this.unixTime = Math.floor(new Date().getTime() / 1000);

    this.noticias = await this.fire.getAllNoticias();

    this.noticias.sort((a:any, b:any) => b.fecha_creacion - a.fecha_creacion);



    // const query = `query SocalTournaments($perPage: Int, $coordinates: String!, $radius: String!) {
    //   tournaments(query: {
    //     perPage: $perPage
    //     filter: {
    //       location: {
    //         distanceFrom: $coordinates,
    //         distance: $radius
    //       },

    //     }
    //   }) {
    //     nodes {
    //       id
    //       name
    //       city
    //       countryCode
    //       images{
    //         url
    //       }
    //       endAt
    //     }
    //   }
    // } `;

    // const variables = {
    //   perPage: 100,
    //   coordinates: "40.4168,3.7038",
    //   radius: "200mi",

    // };

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
        this.torneos = await data.data.tournaments.nodes;

        this.torneos = this.torneos.filter((torneo:any) => torneo.endAt > this.unixTime)

      })
      .catch(error => console.error(error));
  }

  loading = true;

  onTwLoad() {
    this.loading = false;
  }

  visualizarEvento(torneo:any){
    this.smash.setEvento(torneo);
    this.router.navigateByUrl("/evento");
  }
}
