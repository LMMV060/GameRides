import { Injectable } from '@angular/core';
import paginas from '../../assets/paginas.json'

import emojis from '../../assets/emojis.json'
@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  constructor() { }

  getPaginas(){
    return paginas;
  }

  getEmojis(){
    return emojis;
  }
}
