import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentesModule } from '../componentes/componentes.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorComponent } from './error/error.component';
import { PeticionesComponent } from './peticiones/peticiones.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    PerfilComponent,
    RegistrarComponent,
    LogoutComponent,
    ErrorComponent,
    PeticionesComponent
  ],
  imports: [
    CommonModule,
    ComponentesModule
  ],
  exports:[
    HomeComponent,
    LoginComponent
  ]
})
export class PaginasModule { }
