import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.logout();
  }

  logout(){
    if (confirm('¿Desea cerrar la sesión?')) {
      this.fire.logout()
    .then(() => {
      this.router.navigateByUrl('/home')
    })
    .catch(error => console.log(error));
    } else {
      this.router.navigateByUrl('/home')
    }


  }
}
