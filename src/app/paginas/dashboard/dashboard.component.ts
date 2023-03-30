import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isAdmin:boolean = false;
  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  async ngOnInit(): Promise<void> {

    const usuarioActual = await this.fire.getCurrentUser();

    this.isAdmin = usuarioActual.isAdmin;

    if(!this.isAdmin){
      this.router.navigateByUrl("/error")
    }
  }

}
