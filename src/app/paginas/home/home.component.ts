import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  token = "d469385fa45e0c309e3c176dd5b62f70";

  torneos = [];
  unixTime: number | undefined;

  ngOnInit() {
    this.unixTime = Math.floor(new Date().getTime() / 1000);
    console.log(this.unixTime);




    const query = `query SocalTournaments($perPage: Int, $coordinates: String!, $radius: String!) {
      tournaments(query: {
        perPage: $perPage
        filter: {
          location: {
            distanceFrom: $coordinates,
            distance: $radius
          },

        }
      }) {
        nodes {
          id
          name
          city
          countryCode
          endAt
        }
      }
    } `;

    const variables = {
      perPage: 100,
      coordinates: "40.4168,3.7038",
      radius: "200mi",

    };

    /*const query = `query TournamentsByCountry($cCode: String!, $perPage: Int!) {
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
      perPage: 22
    };*/

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
      .then(data => {
        console.log(data.data.tournaments.nodes)
        this.torneos = data.data.tournaments.nodes;
        console.log(this.torneos);

      })
      .catch(error => console.error(error));
  }

  loading = true;

  onTwLoad() {
    this.loading = false;
  }

}
