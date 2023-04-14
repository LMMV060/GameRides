import { Component } from '@angular/core';
import { CocheService } from 'src/app/servicios/coche.service';

@Component({
  selector: 'app-editar-coche',
  templateUrl: './editar-coche.component.html',
  styleUrls: ['./editar-coche.component.css']
})
export class EditarCocheComponent {
  cocheAEditar:any;
  constructor(
    private coche:CocheService
  ){

  }

  async ngOnInit() {
    this.cocheAEditar = await this.coche.getCoche()

    console.log(this.cocheAEditar);

  }

}
