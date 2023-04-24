import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, updateProfile, getAuth, deleteUser, updateEmail, updatePassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { collection, deleteDoc, doc, DocumentData, Firestore, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuarios } from '../interfaces/usuarios';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { Storage, getDownloadURL, getStorage, listAll, ref, uploadBytes } from '@angular/fire/storage';
import { getDatabase, set } from 'firebase/database';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  VehiculosTotales: any = [];
  misVehiculos: any = [];
  VehiculoEspecifico:any;

  constructor(
    private auth: Auth,
    private bbdd:Firestore,
    private router: Router,
    private storage:Storage
    ) { }

  register(email:any, pwd:any, nombre:any){
    return createUserWithEmailAndPassword(this.auth, email, pwd)
    .then(()=> {
      if(this.auth.currentUser){
        updateProfile(this.auth.currentUser, {
          displayName: nombre,
          photoURL: "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png"
        })
      }
    });

  }

  login(email:any, pwd:any){
    return signInWithEmailAndPassword(this.auth, email, pwd);
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
    .then(()=> {
      if(this.auth.currentUser){
        updateProfile(this.auth.currentUser, {
          displayName: this.auth.currentUser.email,
          photoURL: "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png"
        })
      }
    });
  }

  logout(){
    return signOut(this.auth);
  }

  basededatos(){
    return this.bbdd;
  }

  deletePeticiones(base:any){
    return base.fecha;
  }

  async getCocheData(matricula:any){
    const querySnapshot = await getDocs(collection(this.basededatos(), "Coches"));
    querySnapshot.forEach((doc) => {

      this.VehiculosTotales.push(doc.data());


    });

    this.VehiculosTotales.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.misVehiculos.push(objeto));

    this.misVehiculos.filter((object:any) => object.alias == matricula).forEach((objeto: any) => {

      return objeto;
      });
  }

  async getUserDataReal(){
    const datos:any = [];
    let usuarioActual:any;

    const querySnapshot = await getDocs(collection(this.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      datos.push(doc.data());
    });

    usuarioActual = datos.filter((objeto:any) => objeto.uid === this.auth.currentUser?.uid);

    return usuarioActual[0];
  }
  async getCurrentUser(){
    const datos:any = [];
    let usuarioActual:any;

    const querySnapshot = await getDocs(collection(this.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      datos.push(doc.data());
    });

    usuarioActual = datos.filter((objeto:any) => objeto.uid === this.auth.currentUser?.uid);

    return usuarioActual[0].isAdmin;

  }

  async updatePwd(uid:any, nuevoPwd:any){
    if(this.auth.currentUser){
      let userActual = doc(this.bbdd, "Usuarios", "Usuario-"+this.auth.currentUser.uid);
      updatePassword(this.auth.currentUser, nuevoPwd).then(async () => {
        await updateDoc(userActual, {
          password: crypto.SHA512(nuevoPwd).toString()
        });

        alert("Contraseña cambiada");

        this.router.navigateByUrl("/home");
      }) .catch(async (error) => {

        if(error.code === 'invalid-argument'){
          alert('No se ha dado ninguna nueva contraseña');
        }

        if(error.code === 'auth/weak-password'){
          alert('La nueva contraseña es demasiado debil')
        }
      });
    }
  }

  async updateEmail(uid:any, nuevoEmail:any){
    if(this.auth.currentUser){
      updateEmail(this.auth.currentUser, nuevoEmail).then(async () => {
        alert("Cambio de email realizado");

        this.router.navigateByUrl("/home");
      }) .catch(async (error) => {

          if(error.code === 'auth/invalid-email'){
            alert('El nuevo email no tiene el formato necesario')
          }

          if(error.code === 'auth/email-already-in-use'){
            alert('El nuevo email ya está en uso por otro usuario')
          }
      })
    }

  }

  async deleteAllFromUser(uid:any){
    try {

    //Borrar coches

    for(let i = 1; i <= 3;i++){
      await deleteDoc(doc(this.basededatos(), "Coches", "Coche-"+i+"-" + uid));
    }

    //Borrarlo de la lista negra

    await deleteDoc(doc(this.basededatos(), "Lista_Negra", "Ban-" + uid));

    //Borrar todas las noticias

    for(let i = 1; i <= 50;i++){
      await deleteDoc(doc(this.basededatos(), "Noticias", "Noticia-"+i+"-" + uid));
    }


    //Borrar peticiones de transporte

    for(let i = 1; i <= 10;i++){
      await deleteDoc(doc(this.basededatos(), "Peticiones", "Peticion-"+i+"-" + uid));
    }


    //Borrar ofertas de transporte

    for(let i = 1; i <= 10;i++){
      await deleteDoc(doc(this.basededatos(), "Transportes", "Transporte-"+i+"-" + uid));
    }


    //Borrar usuario

    await deleteDoc(doc(this.basededatos(), "Usuarios", "Usuario-" + uid));
    if(this.auth.currentUser){
      deleteUser(this.auth.currentUser).then(async () => {

      })
    }

    } catch(err){
      console.log(err);
    }



  }

  async getAllUsers(){
    const datos:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Usuarios"));
    querySnapshot.forEach((doc) => {

      datos.push(doc.data());
    });

    let usuariosBuenos:any = [];

    usuariosBuenos = datos.filter((objeto:any) => !objeto.isDisabled);
    return usuariosBuenos;
  }

  async getAllPeticiones(){
    const peticiones:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Peticiones"));
    querySnapshot.forEach((doc) => {

      peticiones.push(doc.data());
    });

    return peticiones;
  }

  async getAllTransportes(){
    const transportes:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Transportes"));
    querySnapshot.forEach((doc) => {

      transportes.push(doc.data());
    });


    return transportes;
  }

  async getAllBans(){
    const lista_negra:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Lista_Negra"));
    querySnapshot.forEach((doc) => {

      lista_negra.push(doc.data());
    });


    return lista_negra;
  }

  async inhabilitar(user:any){
    const usuario = doc(this.basededatos(), "Usuarios", "Usuario-"+user.uid);

    if(user.uid === this.auth.currentUser?.uid){
      alert("My brother/sister in christ te quieres banear a ti mismo?");

    } else {
      //await deleteDoc(doc(this.basededatos(), "Usuarios", user.uid));
      await updateDoc(usuario, {
        isDisabled: true
      });

      const usuarioBan:Usuarios = {
        uid: user.uid || "",
        nombre: user.nombre || "",
        imgUrl: user.imgUrl|| "",
        password: user.password || "?",
        isAdmin: false,
        isDisabled:true,
        descripcion: ""
      }

      const ban = await setDoc(doc(this.basededatos(), "Lista_Negra", "Ban-"+user.uid), usuarioBan)
    }

  }

  async borrarTransporte(Transporte:any){
    await deleteDoc(doc(this.basededatos(), "Transportes", Transporte.id))
    .then(()=> {
      alert("Transporte borrado");
      location.reload();
    })
    .catch(err => {
      console.log(err);
    })

  }

  async borrarPeticion(Peticion:any){
    await deleteDoc(doc(this.basededatos(), "Peticiones", Peticion.id))
    .then(()=> {
      alert("Peticion borrada, porfavor, actualiza")
    })
    .catch(err => {
      console.log(err);

    })

  }

  async perdonarUsuario(usuario:any){
    const user = doc(this.basededatos(), "Usuarios", "Usuario-"+usuario.uid);


    await deleteDoc(doc(this.basededatos(), "Lista_Negra", "Ban-"+usuario.uid))
    .then(async ()=> {
      await updateDoc(user, {
        isDisabled: false
      });
      alert("Usuario desbaneado")
    })
    .catch(err => {
      console.log(err);

    })

  }

  async getAllNoticias(){
    const Noticias:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Noticias"));
    querySnapshot.forEach((doc) => {

      Noticias.push(doc.data());
    });


    return Noticias;
  }

  async getNoticiaByUser(uid:any){

  }

  async enviarRecuperacionContra(email:any){
    sendPasswordResetEmail(this.auth, email).then(()=> {
      alert("Correo enviado");

    })
  }

  async guardarNuevaImagen(uid:any, img:any){
    const imgRef = ref(this.storage, `ImagenesUsuarioPerfil/${uid}`);
    if(img === undefined){

    } else {
      uploadBytes(imgRef, img)
    .then(response => {

    }).catch(err => console.log(err))
    }
  }

  descripcion:any;

  async guardarNuevaDescripcion(descripcion:any){
    if(descripcion === undefined){
      this.descripcion = ""
    } else {
      this.descripcion = descripcion;
    }
  }

  async guardar(uid:any){
    const imgRef:any = await ref(this.storage, `ImagenesUsuarioPerfil`);
    let userActual = await doc(this.bbdd, "Usuarios", "Usuario-"+this.auth.currentUser?.uid);

    getDownloadURL(ref(this.storage, 'ImagenesUsuarioPerfil/'+this.auth.currentUser?.uid))
    .then(async (url) => {
      if(this.auth.currentUser){
        await updateProfile(this.auth.currentUser, {
          photoURL: url
        })
        await updateDoc(userActual, {
          imgUrl: url,
          descripcion: this.descripcion
        });

        this.getAllPeticiones().then(peti => {
          for(let user of peti){

          }
        })
      }
    })
  }


  async meInteresaTransporte(id:any, uid:any){
    let ofertaInteresada = await doc(this.bbdd, "Transportes", id);
    let prueba = await this.getAllTransportes()
    let interesados:any = [];
    let rechazados:any = [];
    let aceptados:any = [];

    prueba = prueba.filter((transporte:any) => transporte.id === id);

    if(prueba[0].interesados === undefined){
      interesados.push(uid);
    } else {
      //Obtiene si ya esta interesado
      interesados = prueba[0].interesados

      //Obtiene los rechazados
      if(prueba[0].rechazados === undefined){
        rechazados = [];
      } else {
        rechazados = prueba[0].rechazados
      }
      //Obtiene los aceptados
      if(prueba[0].aceptados === undefined){
        aceptados = [];
      } else {
        aceptados = prueba[0].aceptados;
      }

      //Comprueba el estado
      if (interesados.includes(uid)) {
        alert("Ya te interesa esta oferta")
      } else {
        if(rechazados.includes(uid)){
          alert("Te han rechazado")
        } else {
          if(aceptados.includes(uid)){
            alert("Ya estas aceptado, ten un buen viaje!")
          } else {
            alert("Te interesa esta oferta de transporte, ahora debes esperar a que te acepten o rechacen la plaza")
            interesados.push(uid);
          }
        }
      }
    }
    await updateDoc(ofertaInteresada, {
      interesados: interesados
    });

  }

  async meInteresaPeticion(id:any, uid:any){
    let peticionInteresada = await doc(this.bbdd, "Peticiones", id);
    let prueba = await this.getAllPeticiones()
    let interesados:any = [];
    let rechazados:any = [];
    let aceptados:any = [];

    prueba = prueba.filter((transporte:any) => transporte.id === id);

    if(prueba[0].interesados === undefined){
      interesados.push(uid);
    } else {
      //Obtiene si ya esta interesado
      interesados = prueba[0].interesados

      //Obtiene los rechazados
      if(prueba[0].rechazados === undefined){
        rechazados = [];
      } else {
        rechazados = prueba[0].rechazados
      }
      //Obtiene los aceptados
      if(prueba[0].aceptados === undefined){
        aceptados = [];
      } else {
        aceptados = prueba[0].aceptados;
      }

      //Comprueba el estado
      if (interesados.includes(uid)) {
        alert("Ya te interesa esta peticion")
      } else {
        if(rechazados.includes(uid)){
          alert("Te han rechazado")
        } else {
          if(aceptados.includes(uid)){
            alert("Ya estas aceptado, dale un buen viaje!")
          } else {
            alert("Te interesa esta petición de transporte, ahora debes esperar a que te acepten o rechacen")
            interesados.push(uid);
          }
        }
      }
    }
    await updateDoc(peticionInteresada, {
      interesados: interesados
    });
  }

}
