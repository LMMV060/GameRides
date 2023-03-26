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
  canActivate(): boolean{
    if(this.auth.currentUser){
      return false;
    }
    return true;
  }

}
