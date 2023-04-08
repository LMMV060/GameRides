import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-recuperar-contra',
  templateUrl: './recuperar-contra.component.html',
  styleUrls: ['./recuperar-contra.component.css']
})
export class RecuperarContraComponent {

  constructor(
    private fire: FirebaseService
  ){

  }

  ngOnInit() {

  }

  email:any;

  recuperar(){
    this.fire.enviarRecuperacionContra(this.email);
  }
}
