import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getStorage, ref } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';
import { Location } from '@angular/common';
import { collection, getDocs } from '@angular/fire/firestore';

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
    private router:Router,
    private location:Location
  ) {

  }

  async ngOnInit() {
    try {

      const usuario:any = await this.fire.getUserDataReal();
      this.img = usuario.imgUrl;
      this.descripcion = usuario.descripcion.replace(/<br>/g, '\n');
      this.updateDescripcionHtml();

    } catch(err){
      this.router.navigateByUrl("/error")
    }


  }



  loading = true;

  onImageLoad() {
    this.loading = false;
  }


  onEditorInput(event:any) {
      this.descripcion = event.target.innerHTML;
  }

  async GuardarCambios(){
    let comprobador:any = true;

    let datos:any = [];
    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {
      datos.push(doc.data());
    });
    let user = await this.fire.getUserDataReal()

    datos.forEach(async (doc:any) => {
      if(doc.nombre == this.nombre){

        if(this.nombre === user.nombre){
          comprobador = true;
        } else {
          comprobador = false;
        }

      }
    })

    if(comprobador){
      await this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, this.imgAGuardar);
      await this.fire.guardarNuevaDescripcion(this.descripcionHtml);
      await this.fire.guardarNuevoNombre(this.nombre);
      await this.fire.guardar(this.auth.currentUser?.uid).then(() => {
        this.router.navigateByUrl('/perfil').then(async () => {

        });
      })
    } else {
      alert("Este nombre ya está en uso")
    }

  }

  cargarImagen($event: any) {
    const archivo = $event.target.files[0];
    const storage = getStorage();
    this.imgAGuardar = archivo;

    // Crear URL de objeto para la imagen
    const urlImagen = URL.createObjectURL(archivo);

    // Sanitizar la URL creada
    const urlSegura: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(urlImagen);

    // Establecer la variable img con la URL sanitizada
    this.img = urlSegura;
  }

  public descripcionHtml: string = '';

  updateDescripcionHtml() {
    this.descripcionHtml = this.descripcion.replace(/\n/g, '<br>');
  }

}
