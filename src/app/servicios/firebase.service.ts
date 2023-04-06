import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, updateProfile, getAuth, deleteUser } from '@angular/fire/auth';
import { collection, deleteDoc, doc, DocumentData, Firestore, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuarios } from '../interfaces/usuarios';



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
    console.log(base.fecha);
    return base.fecha;
  }

  async getCocheData(matricula:any){
    const querySnapshot = await getDocs(collection(this.basededatos(), "Coches"));
    querySnapshot.forEach((doc) => {

      this.VehiculosTotales.push(doc.data());


    });

    this.VehiculosTotales.filter((objeto:any) => objeto.uid == this.auth.currentUser?.uid).forEach((objeto: any) => this.misVehiculos.push(objeto));

    this.misVehiculos.filter((object:any) => object.alias == matricula).forEach((objeto: any) => {
      console.log(objeto);

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

    console.log(usuarioActual[0].nombre);
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

    console.log(usuarioActual[0]);
    return usuarioActual[0].isAdmin;

  }

  async deleteAllFromUser(uid:any){
    try {

    //Borrar coches

    for(let i = 1; i <= 3;i++){
      await deleteDoc(doc(this.basededatos(), "Coches", "Coche-"+i+"-" + uid));
    }
    console.log("Coches borrados");

    //Borrarlo de la lista negra

    await deleteDoc(doc(this.basededatos(), "Lista_Negra", "Ban-" + uid));
    console.log("Baneado borrado");

    //Borrar todas las noticias

    for(let i = 1; i <= 50;i++){
      await deleteDoc(doc(this.basededatos(), "Noticias", "Noticia-"+i+"-" + uid));
    }

    console.log("Noticias borradas");

    //Borrar peticiones de transporte

    for(let i = 1; i <= 10;i++){
      await deleteDoc(doc(this.basededatos(), "Peticiones", "Peticion-"+i+"-" + uid));
    }

    console.log("Peticiones borradas");

    //Borrar ofertas de transporte

    for(let i = 1; i <= 10;i++){
      await deleteDoc(doc(this.basededatos(), "Transportes", "Transporte-"+i+"-" + uid));
    }

    console.log("Ofertas borradas");

    //Borrar usuario

    await deleteDoc(doc(this.basededatos(), "Usuarios", "Usuario-" + uid));
    if(this.auth.currentUser){
      deleteUser(this.auth.currentUser).then(async () => {
        console.log("Usuario borrado");
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


    console.log(peticiones);
    return peticiones;
  }

  async getAllTransportes(){
    const transportes:any = [];

    const querySnapshot = await getDocs(collection(this.basededatos(), "Transportes"));
    querySnapshot.forEach((doc) => {

      transportes.push(doc.data());
    });


    console.log(transportes);
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
      console.log("My brother in christ te quieres banear a ti mismo?");

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
        isDisabled:true
      }
      console.log("Baneando al usuario: ",usuarioBan);

      const ban = await setDoc(doc(this.basededatos(), "Lista_Negra", "Ban-"+user.uid), usuarioBan)
    }

  }

  async borrarTransporte(Transporte:any){
    await deleteDoc(doc(this.basededatos(), "Transportes", Transporte.id))
    .then(()=> {
      alert("Transporte borrado, porfavor, actualiza")
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
      console.log("teperD0no");
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
}
