import { Component, OnInit } from '@angular/core';
import { FuncionesService } from './servicios/funciones.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'introAngular';
  public paginas:any;

  constructor(
    private servi: FuncionesService,
  ){

  }

  async ngOnInit() {
    this.paginas = await this.servi.getPaginas();
  }

}
