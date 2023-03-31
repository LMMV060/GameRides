import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    this.logout();
  }

  logout(){
    if(this.auth.currentUser){
      if (confirm('¿Desea cerrar la sesión?')) {
        this.fire.logout()
      .then(() => {
        this.router.navigateByUrl('/home')
      })
      .catch(error => console.log(error));
      } else {
        this.router.navigateByUrl('/home')
      }
    } else {
      alert("Ninguna sesión iniciada")
      this.router.navigateByUrl('/home')
    }



  }
}
