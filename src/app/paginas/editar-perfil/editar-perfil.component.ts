import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getStorage, ref } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';


@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent {


  public nombre:any = this.auth.currentUser?.displayName;
  public img:any = this.auth.currentUser?.photoURL;
  public descripcion:any;

  public imgAGuardar:any;



  constructor(
    private fire: FirebaseService,
    private auth: Auth,
    private sanitizer: DomSanitizer,
    private router:Router
  ) {

  }

  async ngOnInit() {
    const usuario:any = await this.fire.getUserDataReal();
    console.log(usuario);
    this.img = usuario.imgUrl;
    this.descripcion = usuario.descripcion;
  }



  loading = true;

  onImageLoad() {
    this.loading = false;
  }


  onEditorInput(event:any) {
      this.descripcion = event.target.innerHTML;
  }

  async GuardarCambios(){
    await this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, this.imgAGuardar);
    await this.fire.guardarNuevaDescripcion(this.descripcion);
    await this.fire.guardar(this.auth.currentUser?.uid);

    this.router.navigateByUrl("/perfil")
  }

  cargarImagen($event: any) {
    const archivo = $event.target.files[0];
    const storage = getStorage();
    console.log(archivo);
    this.imgAGuardar = archivo;

    // Crear URL de objeto para la imagen
    const urlImagen = URL.createObjectURL(archivo);

    // Sanitizar la URL creada
    const urlSegura: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(urlImagen);

    // Establecer la variable img con la URL sanitizada
    this.img = urlSegura;
  }


}
