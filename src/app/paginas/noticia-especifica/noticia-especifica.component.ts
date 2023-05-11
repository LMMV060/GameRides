import { FirebaseService } from './../../servicios/firebase.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-noticia-especifica',
  templateUrl: './noticia-especifica.component.html',
  styleUrls: ['./noticia-especifica.component.css']
})
export class NoticiaEspecificaComponent {

  nombre:any;
  noticias:any = [];
  noticiaEspecifica:any;
  otrasNoticias:any = [];

  constructor(
    private route: ActivatedRoute,
    private fire: FirebaseService,
    private router:Router,

  ) {

  }

  async ngOnInit() {
    this.nombre = decodeURI(this.route.snapshot.paramMap.get('titulo') || '');
    this.noticias = await this.fire.getAllNoticias();

    const tituloDecodificado = decodeURIComponent(this.nombre);
    this.noticiaEspecifica = this.noticias.filter((noticia: any) => noticia.titulo === tituloDecodificado);

    this.otrasNoticias = await this.fire.getNoticiaByUser(this.noticiaEspecifica[0].uid);

    this.otrasNoticias = this.otrasNoticias.filter((noticia: any) => noticia.id !== this.noticiaEspecifica[0].id);

    this.otrasNoticias = this.otrasNoticias.slice(0,4);


    if (this.noticiaEspecifica.length > 0) {
      //console.log('La noticia seleccionada es:', this.noticiaEspecifica[0]);
    } else {
      this.router.navigateByUrl("/error");
    }
  }

  async irANoticia(titulo:string){
    this.router.navigateByUrl("noticias/"+titulo)
    .then(() => {
      location.reload();

    })
  }


}
