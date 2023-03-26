import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, updateProfile } from '@angular/fire/auth';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  VehiculosTotales: any = [];
  misVehiculos: any = [];
  VehiculoEspecifico:any;

  constructor(
    private auth: Auth,
    private bbdd:Firestore
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

}
