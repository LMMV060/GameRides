import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private auth: Auth,
    private router:Router,){

  }
  canActivate(): boolean{
    if(!this.auth.currentUser){
      this.router.navigateByUrl("/error")
      return false;
    }
    return true;
  }

}
