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
import { BuscarUsuarioComponent } from './buscar-usuario/buscar-usuario.component';
import { PerfilAjenoComponent } from './perfil-ajeno/perfil-ajeno.component';
import { NgOptimizedImage } from '@angular/common'
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CochesComponent } from './coches/coches.component';
import { FormsModule } from '@angular/forms';
import { AjustesComponent } from './ajustes/ajustes.component';
import { MatProgressSpinnerModule } from '@angular/material';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    PerfilComponent,
    RegistrarComponent,
    LogoutComponent,
    ErrorComponent,
    PeticionesComponent,
    BuscarUsuarioComponent,
    PerfilAjenoComponent,
    DashboardComponent,
    CochesComponent,
    AjustesComponent,

  ],
  imports: [
    CommonModule,
    ComponentesModule,
    NgOptimizedImage,
    MatCardModule,
    MatBadgeModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports:[
    HomeComponent,
    LoginComponent
  ]
})
export class PaginasModule { }
