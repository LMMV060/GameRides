import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    CabeceraComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ],

  exports:[
    CabeceraComponent,
    FooterComponent
  ]
})
export class ComponentesModule { }
