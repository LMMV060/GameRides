import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home.component';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { RegistrarComponent } from './paginas/registrar/registrar.component';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LogoutComponent } from './paginas/logout/logout.component';
import { ErrorComponent } from './paginas/error/error.component';
import { PeticionesComponent } from './paginas/peticiones/peticiones.component';
const rutas:Routes = [
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'perfil',
    component: PerfilComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'peticiones',
    component: PeticionesComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'registrar',
    component: RegistrarComponent
  },
  {
    path:'logout',
    component: LogoutComponent
  },
  {
    path:'**',
    component: ErrorComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(rutas)
  ],
  exports:[
    RouterModule
  ]

})
export class AppRoutingModule { }
