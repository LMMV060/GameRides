import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent {

  usuario:any = [];



  constructor(
    private fire: FirebaseService,
    private auth: Auth
  ) {

  }

  async ngOnInit() {


  }

  public nombre:any = this.auth.currentUser?.displayName;
  public img:any = this.auth.currentUser?.photoURL;

  loading = true;

  onImageLoad() {
    this.loading = false;
  }

  descripcion = '';

  onEditorInput(event:any) {
    this.descripcion = event.target.innerHTML;
    console.log(this.descripcion);
  }

  GuardarCambios(){
    this.fire.guardarNuevaImagen(this.auth.currentUser?.uid, this.img);

    this.fire.guardar(this.auth.currentUser?.uid);
  }

  seleccionarImagen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event: any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.img = e.target.result;
        console.log(this.img);
      }
      reader.readAsDataURL(event.target.files[0]);
    });
    input.click();
  }
}
