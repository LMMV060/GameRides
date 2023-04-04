import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firebaseApp$, initializeApp } from '@angular/fire/app';
import { Auth, deleteUser, getAuth } from '@angular/fire/auth';
import { deleteDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Noticia } from 'src/app/interfaces/noticia';
import { FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  usuarios:any = [];
  usuariosFiltrados:any = [];
  peticiones:any = [];
  peticionesFiltradas:any = [];
  transportes:any = [];
  transportesFiltrados:any = [];
  lista_negra:any = [];
  lista_negra_filtrada:any = [];
  isAdmin:boolean = false;

  emojis:any = [];
  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth,
    private a: FuncionesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.emojis = this.a.getEmojis();

    this.usuarios = await this.fire.getAllUsers();
    this.usuariosFiltrados = await this.fire.getAllUsers();
    this.peticiones = await this.fire.getAllPeticiones();
    this.peticionesFiltradas = await this.fire.getAllPeticiones();
    this.transportes = await this.fire.getAllTransportes();
    this.transportesFiltrados = await this.fire.getAllTransportes();
    this.lista_negra = await this.fire.getAllBans();
    this.lista_negra_filtrada = await this.fire.getAllBans();
    console.log(this.peticiones);

    try{
      const admin = await this.fire.getCurrentUser();

      if(admin){
        console.log("Bienvenido");

      } else {
        this.router.navigateByUrl("/error")
      }
    } catch(err){
      this.router.navigateByUrl("/error")
    }



  }

  opcionSeleccionada:any = "Usuarios";

  Busqueda(event:any){

    console.log(event.target.value);
    this.opcionSeleccionada = event.target.value;
  }

  ObtenerNombre(event:any){
    const text = event.target.value;

    console.log(text)
  }

  async eliminarUsuario(usuario:any){
    this.fire.inhabilitar(usuario);
    /*if (confirm('¿Está seguro de que desea eliminar esta petición?')) {

      await deleteDoc(doc(this.fire.basededatos(), "Usuarios", usuario.uid));

      console.log("Objeto eliminado:", usuario);
    }*/
  }

  async eliminarTransporte(Transporte:any){
    this.fire.borrarTransporte(Transporte);
  }

  async eliminarPeticion(Peticion:any){
    this.fire.borrarPeticion(Peticion);
  }

  async perdonarUsuario(usuario:any){
    this.fire.perdonarUsuario(usuario);
  }


  ObtenerNombreUsuario(event:any){
    const text = event.target.value;
    if (text && text.trim() !== '') {
      this.usuariosFiltrados = this.usuarios.filter((item:any) => {
          return (item.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }else {
      this.usuariosFiltrados = this.usuarios;
    }
    console.log(text)
  }

  ObtenerNombreTransporte(event:any){
    const text = event.target.value;
    if (text && text.trim() !== '') {
      this.transportesFiltrados = this.transportes.filter((item:any) => {
          return (item.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }else {
      this.transportesFiltrados = this.transportes;
    }
    console.log(text)
  }

  ObtenerNombrePeticiones(event:any){
    const text = event.target.value;
    if (text && text.trim() !== '') {
      this.peticionesFiltradas = this.peticiones.filter((item:any) => {
          return (item.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }else {
      this.peticionesFiltradas = this.peticiones;
    }
    console.log(text)
  }

  ObtenerNombreBan(event:any){
    const text = event.target.value;
    if (text && text.trim() !== '') {
      this.lista_negra_filtrada = this.lista_negra.filter((item:any) => {
          return (item.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }else {
      this.lista_negra_filtrada = this.lista_negra;
    }
    console.log(text)
  }

  contenidoEditor = '';

  onEditorInput(event:any) {
    this.contenidoEditor = event.target.innerHTML;
    console.log(this.contenidoEditor);
  }

  titulo:any = "";

  subtitulo:any = "";


  addLink() {
    const url = prompt("Por favor ingrese la URL del enlace:");
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }



  /*
  rutaImagen = ''; // propiedad para guardar la ruta de la imagen

  insertarImagen() {
    const imagen = '<img src="' + this.rutaImagen + ' style="width: 50px;"">'; // agregar la ruta de la imagen
    this.contenidoEditor += imagen;

    console.log(this.contenidoEditor);

  }

  seleccionarImagen(event: any) {
    const archivo = event.target.files[0]; // obtener el archivo seleccionado
    const lector = new FileReader();
    lector.readAsDataURL(archivo); // leer el archivo como base64
    lector.onload = () => {
      this.rutaImagen = lector.result as string; // guardar la ruta de la imagen como base64

      this.insertarImagen();
    };
  }*/

  mostrandoEmojis = false;

  mostrarEmojis() {
    this.mostrandoEmojis = !this.mostrandoEmojis;
  }

  insertarEmoji(emoji: any) {
    const editor:any = document.getElementById('editor');
    editor.innerHTML += emoji;
    editor.focus();
  }

  async guardarNoticia(){
    if(this.titulo === "" || this.subtitulo === "" || this.contenidoEditor === ''){
      console.log("error");

    } else {
      for(let i = 1; i<= 30; i++){
        const docRef = doc(this.fire.basededatos(), "Noticias", "Noticia-"+ i + "-"+this.auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 30){
            console.log("Numero máximo de noticias alcanzadas");
          }
        } else {
          let usuarioActual:any = await this.fire.getUserDataReal();
          let noticia:Noticia = {
            id: "Noticia-"+ i + "-"+this.auth.currentUser?.uid,
            titulo: this.titulo,
            subtitulo: this.subtitulo,
            contenido: this.contenidoEditor,
            fecha_creacion: Math.floor(new Date().getTime() / 1000),
            uid: this.auth.currentUser?.uid,
            nombre_user: usuarioActual.nombre
          }

          const response = await setDoc(doc(this.fire.basededatos(), "Noticias", "Noticia-"+ i + "-"+this.auth.currentUser?.uid), noticia)
          console.log("Noticia creada");
          location.reload();
          i = 31;

        }
      }
    }
  }
}
