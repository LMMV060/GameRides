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
import { BuscarUsuarioComponent } from './paginas/buscar-usuario/buscar-usuario.component';
import { PerfilAjenoComponent } from './paginas/perfil-ajeno/perfil-ajeno.component';
import { CochesComponent } from './paginas/coches/coches.component';
import { AuthGuard } from './guards/auth.guard';
import { AjustesComponent } from './paginas/ajustes/ajustes.component';
const rutas:Routes = [
  {
    path:'',
    component: HomeComponent
  },
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
    path: 'perfil/:nombre',
    component: PerfilAjenoComponent
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'coches',
    component: CochesComponent,
  },
  {
    path:'usuarios',
    component: BuscarUsuarioComponent
  },
  {
    path:'registrar',
    component: RegistrarComponent
  },
  {
    path:'ajustes',
    component: AjustesComponent
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
