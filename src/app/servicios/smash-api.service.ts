import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SmashAPIService {
  token = "d469385fa45e0c309e3c176dd5b62f70";
  torneos:any = [];

  eventoVisualizar:any = [];

  constructor() { }

  getTorneosByCountry(array:any){
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

        array = await data.data.tournaments.nodes;

      })
      .catch(error => console.error(error));

  }

  setEvento(evento:any){
    this.eventoVisualizar = evento;
  }

  getEvento(){
    return this.eventoVisualizar;
  }

  getTorneoByName(){
    const query = `query TournamentsByCountry($name: String!, $perPage: Int!) {
      tournaments(query: {
        perPage: $perPage
        filter: {
          name: $name
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
      name: `weekly`,
      perPage: 1
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
        console.log(data.data.tournaments.nodes);
      })
      .catch(error => console.error(error));

  }
}

