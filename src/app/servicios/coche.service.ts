import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CocheService {

  Coche: any;

  constructor(
    private fire: FirebaseService
  ) { }

  setCoche(Coche: any) {
    this.Coche = Coche;
  }

  getCoche() {
    return this.Coche;
  }
}
