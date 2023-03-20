import { Router } from '@angular/router';
import { FirebaseService } from './../../servicios/firebase.service';
import { initializeApp } from '@angular/fire/app';
import { Auth, getAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public nombre = this.auth.currentUser?.displayName;
  public img = this.auth.currentUser?.photoURL;

  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    console.log(this.auth.currentUser);

  }

  Editar(){
  }

  loading = true;

  onImageLoad() {
    this.loading = false;
  }

}
