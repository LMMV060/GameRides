import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firebaseApp$, initializeApp } from '@angular/fire/app';
import { Auth, deleteUser, getAuth } from '@angular/fire/auth';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Noticia } from 'src/app/interfaces/noticia';
import { FuncionesService } from 'src/app/servicios/funciones.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  reportes:any = [];
  isAdmin:boolean = false;

  emojis:any = [];
  constructor(
    private fire: FirebaseService,
    private router:Router,
    private auth: Auth,
    private a: FuncionesService,
    private sanitizer: DomSanitizer,
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
    this.cargarReportes();

    try{
      const admin = await this.fire.getCurrentUser();

      if(admin){

      } else {
        this.router.navigateByUrl("/error")
      }
    } catch(err){
      this.router.navigateByUrl("/error")
    }



  }

  opcionSeleccionada:any = "Usuarios";

  Busqueda(event:any){

    this.opcionSeleccionada = event.target.value;
  }

  ObtenerNombre(event:any){
    const text = event.target.value;

  }

  async eliminarUsuario(usuario:any){
    this.fire.inhabilitar(usuario);

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
  }

  contenidoEditor = '';

  onEditorInput(event:any) {
    this.contenidoEditor = event.target.innerHTML;
    //console.log(this.contenidoEditor);
  }

  titulo:any = "";

  subtitulo:any = "";


  addLink() {
    const url = prompt("Por favor ingrese la URL del enlace:");
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  imgAGuardar:any = '';
  img:any = '';
  cargarImagen($event: any) {
    const archivo = $event.target.files[0];
    const storage = getStorage();
    this.imgAGuardar = archivo;

    // Crear URL de objeto para la imagen
    const urlImagen = URL.createObjectURL(archivo);

    // Sanitizar la URL creada
    const urlSegura: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(urlImagen);

    // Establecer la variable img con la URL sanitizada
    this.img = urlSegura

    /*
    Funciona

    const storageRef = ref(storage,'NoticiasImgs/Noticia-'+ this.auth.currentUser?.uid);
    uploadBytes(storageRef, archivo)
    .then(response => {
      console.log(response);
      getDownloadURL(ref(storage, 'NoticiasImgs/Noticia-'+ this.auth.currentUser?.uid))
    .then(async (url) => {
      console.log(url);
    })

    }).catch(err => console.log(err))

    */

  }

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

    const storage = getStorage();
    if(this.titulo === "" || this.subtitulo === "" || this.contenidoEditor === '' || this.imgAGuardar === ''){
      alert("No se pudo crear la noticia, faltán atributos");
    } else {
      if(/[\[\]{}\|\\\^~\[\]`"<>#?%]/.test(this.titulo)){
        alert("No se permiten caracteres especiales en el título.");
      } else {

        this.loading = true;
      for(let i = 1; i<= 30; i++){
        const docRef = doc(this.fire.basededatos(), "Noticias", "Noticia-"+ i + "-"+this.auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          if(i == 30){
            alert("Numero máximo de noticias alcanzadas");
          }
        } else {
          let usuarioActual:any = await this.fire.getUserDataReal();

          const storageRef = ref(storage,'NoticiasImgs/Noticia-'+i+'-'+ this.auth.currentUser?.uid);
          //Hay que arreglar la propiedad de img
          await uploadBytes(storageRef, this.imgAGuardar)
          .then(async response => {

          }).catch(err => console.log(err));
            let noticia:Noticia = {
              id: "Noticia-"+ i + "-"+this.auth.currentUser?.uid,
              titulo: this.titulo,
              subtitulo: this.subtitulo,
              contenido: this.contenidoEditor,
              fecha_creacion: this.convertirUnixAFecha(Math.floor(new Date().getTime() / 1000)),
              uid: this.auth.currentUser?.uid,
              nombre_user: usuarioActual.nombre,
              imagen: ''
            }


            const response = await setDoc(doc(this.fire.basededatos(), "Noticias", "Noticia-"+ i + "-"+this.auth.currentUser?.uid), noticia)
            alert("Noticia creada");
            let noticiaRef = await doc(this.fire.basededatos(), "Noticias",  "Noticia-"+ i + "-"+this.auth.currentUser?.uid);
            getDownloadURL(ref(storage, 'NoticiasImgs/Noticia-'+i+'-'+ this.auth.currentUser?.uid))
            .then(async (url) => {
              await updateDoc(noticiaRef, {
                imagen: url,
              })
              .then(()=> {
                this.loading = false;
                location.reload();
              })
            })
            i = 31;

        }
      }

      }
    }
  }





  convertirUnixAFecha(unix: number): string {
    const fecha = new Date(unix * 1000); // Convertir el número unix a milisegundos
    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Añadir un 0 si el mes es de un solo dígito
    const dia = ('0' + fecha.getDate()).slice(-2); // Añadir un 0 si el día es de un solo dígito
    return `${anio}-${mes}-${dia}`;
  }

  async irAPerfil(nombre:any){

    const usuarioActual:any = await this.fire.getUserDataReal();

    if(usuarioActual.nombre === nombre){
      this.router.navigateByUrl("/perfil");
    } else {
      this.router.navigateByUrl("/perfil/"+nombre);
    }

  }

  async cargarReportes() {
    this.reportes = await this.fire.getAllReportes();
    for (let i = 0; i < this.reportes.length; i++) {
      const uid = this.reportes[i].uid;
      const usuario = await this.fire.getUserByUID(uid)
      this.reportes[i].usuario = usuario;
    }
  }

  loading = false;
}
