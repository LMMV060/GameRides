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
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { NoticiasComponent } from './paginas/noticias/noticias.component';
import { NoticiaEspecificaComponent } from './paginas/noticia-especifica/noticia-especifica.component';
import { RecuperarContraComponent } from './paginas/recuperar-contra/recuperar-contra.component';
import { EditarPerfilComponent } from './paginas/editar-perfil/editar-perfil.component';
import { ChatComponent } from './paginas/chat/chat.component';
import { VisualizarOfertaComponent } from './paginas/visualizar-oferta/visualizar-oferta.component';
import { VisualizarEventoComponent } from './paginas/visualizar-evento/visualizar-evento.component';
import { EditarPeticionComponent } from './paginas/editar-peticion/editar-peticion.component';
import { EditarOfertaComponent } from './paginas/editar-oferta/editar-oferta.component';
import { EditarCocheComponent } from './paginas/editar-coche/editar-coche.component';
import { InteresadosComponent } from './paginas/interesados/interesados.component';
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
    path:'editar-perfil',
    component: EditarPerfilComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'editar-coche',
    component: EditarCocheComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'editar-peticion',
    component: EditarPeticionComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'editar-oferta',
    component: EditarOfertaComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'mis-chats',
    component: ChatComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'interesados',
    component: InteresadosComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path:'evento',
    component: VisualizarEventoComponent
  },
  {
    path:'peticiones',
    component: PeticionesComponent
  },
  {
    path:'ofertasTransportes',
    component: VisualizarOfertaComponent
  },
  {
    path: 'perfil/:nombre',
    component: PerfilAjenoComponent,
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'recuperar-contra',
    component: RecuperarContraComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'coches',
    component: CochesComponent,
  },
  {
    path:'noticias',
    component: NoticiasComponent
  },
  {
    path: 'noticias/:titulo',
    component: NoticiaEspecificaComponent,
  },
  {
    path:'usuarios',
    component: BuscarUsuarioComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    //canActivate:[DashboardGuard]
  },
  {
    path:'registrar',
    component: RegistrarComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'ajustes',
    component: AjustesComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
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
