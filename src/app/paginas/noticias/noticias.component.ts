import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent {
  noticias:any = [];
  currentNoticiaIndex = 0;
  noticiasPerPage = 4;

  constructor(
    private fire: FirebaseService,
    private router:Router,
  ){

  }

  async ngOnInit() {
    this.noticias = await this.fire.getAllNoticias();
    this.noticias.sort((a:any, b:any) => {
      const fechaA = new Date(a.fecha_creacion);
      const fechaB = new Date(b.fecha_creacion);
      return fechaB.getTime() - fechaA.getTime();
    });
  }

  convertirUnixAFecha(unix: number): string {
    const fecha = new Date(unix * 1000); // Convertir el número unix a milisegundos
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Añadir un 0 si el mes es de un solo dígito
    const dia = ('0' + fecha.getDate()).slice(-2); // Añadir un 0 si el día es de un solo dígito
    return `${anio}-${mes}-${dia}`;
  }

  irANoticia(titulo:string){
    this.router.navigateByUrl("noticias/"+titulo)
  }

  canGoBack() {
    return this.currentNoticiaIndex > 0;
  }

  canGoForward() {
    return this.currentNoticiaIndex + this.noticiasPerPage < this.noticias.length;
  }

  onBack(): void {
    if (this.canGoBack()) {
      this.currentNoticiaIndex -= this.noticiasPerPage;
    }
  }

  onForward(): void {
    if (this.canGoForward()) {
      this.currentNoticiaIndex += this.noticiasPerPage;
    }
  }

}
