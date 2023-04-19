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
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaEspecificaComponent } from './noticia-especifica/noticia-especifica.component';
import { RecuperarContraComponent } from './recuperar-contra/recuperar-contra.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { VisualizarOfertaComponent } from './visualizar-oferta/visualizar-oferta.component';
import { VisualizarPeticionComponent } from './visualizar-peticion/visualizar-peticion.component';
import { EditarPeticionComponent } from './editar-peticion/editar-peticion.component';
import { EditarOfertaComponent } from './editar-oferta/editar-oferta.component';
import { VisualizarEventoComponent } from './visualizar-evento/visualizar-evento.component';
import { EditarCocheComponent } from './editar-coche/editar-coche.component';
import { InteresadosComponent } from './interesados/interesados.component';

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
    NoticiasComponent,
    NoticiaEspecificaComponent,
    RecuperarContraComponent,
    EditarPerfilComponent,
    ChatComponent,
    VisualizarOfertaComponent,
    VisualizarPeticionComponent,
    EditarPeticionComponent,
    EditarOfertaComponent,
    VisualizarEventoComponent,
    EditarCocheComponent,
    InteresadosComponent,
  ],
  imports: [
    CommonModule,
    ComponentesModule,
    NgOptimizedImage,
    MatCardModule,
    MatBadgeModule,
    FormsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  exports:[
    HomeComponent,
    LoginComponent
  ]
})
export class PaginasModule { }
