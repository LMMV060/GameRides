import { Component } from '@angular/core';
import { InteresadosService } from 'src/app/servicios/interesados.service';

@Component({
  selector: 'app-interesados',
  templateUrl: './interesados.component.html',
  styleUrls: ['./interesados.component.css']
})
export class InteresadosComponent {

  constructor(
    private inter: InteresadosService
  ){

  }

  ngOnInit(){
    this.inter.getOferta();
  }

}
