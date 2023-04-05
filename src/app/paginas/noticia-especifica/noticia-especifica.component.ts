import { FirebaseService } from './../../servicios/firebase.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-noticia-especifica',
  templateUrl: './noticia-especifica.component.html',
  styleUrls: ['./noticia-especifica.component.css']
})
export class NoticiaEspecificaComponent {

  nombre:any;
  noticias:any = [];
  noticiaEspecifica:any;

  constructor(
    private route: ActivatedRoute,
    private fire: FirebaseService
  ) {

  }

  async ngOnInit() {
    this.nombre = this.route.snapshot.paramMap.get('titulo') || "";
    this.noticias = await this.fire.getAllNoticias();

    this.noticiaEspecifica = this.noticias.filter((noticia:any) => noticia.titulo === this.nombre);

    if (this.noticiaEspecifica.length > 0) {
      console.log('La noticia seleccionada es:', this.noticiaEspecifica[0]);
    } else {
      console.log('Error: no se encontró ninguna noticia con el título');
    }


  }
}
