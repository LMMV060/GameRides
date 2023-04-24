import { Component, OnInit } from '@angular/core';
import { FuncionesService } from './servicios/funciones.service';
import { FirebaseService } from './servicios/firebase.service';
import { collection, deleteDoc, getDocs, doc, updateDoc, arrayRemove } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'GameRides';
  public paginas:any;
  private user:any;

  constructor(
    private servi: FuncionesService,
    private fire:FirebaseService,
    private auth: Auth,
  ){

  }

  async ngOnInit() {
    this.user = await this.fire.getUserDataReal();
    this.paginas = await this.servi.getPaginas();

    const unixTime = Math.floor(new Date().getTime() / 1000);
    //El momento "hoy"
    const fechaLimite: Date = new Date(this.convertirUnixAFecha(unixTime));

    //Borra Peticiones

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach(async (docu) => {

      const fechaJuzgada:Date = new Date(this.fire.deletePeticiones(docu.data()));

      //Borrar peticiones segun la fecha
      if(fechaJuzgada <= fechaLimite){
        await deleteDoc(doc(this.fire.basededatos(), "Peticiones", docu.id));
      }
    });

    //Borra peticiones del usuario si se ha pasado la fecha limite
    if(this.user.peticionesAceptadas){
      for(let i = 0; i < this.user.peticionesAceptadas.length;i++){
        let fechaAceptada = new Date(this.user.peticionesAceptadas[i].fecha);
        if (fechaAceptada.getTime() >= fechaLimite.getTime()) {
          //Guardar
        } else {
          let userRef = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser?.uid);

          if(this.auth.currentUser){
            await updateDoc(userRef, {
              peticionesAceptadas: arrayRemove(this.user.peticionesAceptadas[i])
            })
          }
        }
      }
    }

    //Borra Ofertas

    const borraTransportes = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    borraTransportes.forEach(async (docu) => {

      const fechaJuzgada:Date = new Date(this.fire.deletePeticiones(docu.data()));
      //Borra ofertas segun la fecha
      if(fechaJuzgada <= fechaLimite){
        await deleteDoc(doc(this.fire.basededatos(), "Transportes", docu.id));
      }

      //Borra las ofertas de los usuarios que hubieran aceptado una oferta en la que se ha pasado la fecha

      if(this.user.ofertasAceptadas){
        for(let i = 0; i < this.user.ofertasAceptadas.length; i++) {
          let fechaAceptada = new Date(this.user.ofertasAceptadas[i].fecha);
          if (fechaAceptada.getTime() >= fechaLimite.getTime()) {
            //Guardar
          } else {
            //Borrar
            let userRef = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+this.auth.currentUser?.uid);
            if(this.auth.currentUser){
              await updateDoc(userRef, {
                ofertasAceptadas:arrayRemove(this.user.ofertasAceptadas[i])
              });
            }
          }
        }
      }
    });

  }

  convertirUnixAFecha(unix:number) {
    const fecha = new Date(unix * 1000);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

}
