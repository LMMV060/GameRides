import { Auth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth){

  }
  //Comprueba que el usuario tiene una sesión activa, en caso afirmativo, devuelve un false para prohibir la entrada a la página
  canActivate(): boolean{
    if(this.auth.currentUser){
      return false;
    }
    return true;
  }

}
