import { Injectable } from '@angular/core';
import paginas from '../../assets/paginas.json'
@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  constructor() { }

  getPaginas(){
    return paginas;
  }
}
