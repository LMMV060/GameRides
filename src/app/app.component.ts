import { Component, OnInit } from '@angular/core';
import { FuncionesService } from './servicios/funciones.service';
import { FirebaseService } from './servicios/firebase.service';
import { collection, deleteDoc, getDocs, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'GameRides';
  public paginas:any;

  constructor(
    private servi: FuncionesService,
    private fire:FirebaseService,
  ){

  }

  async ngOnInit() {

    this.paginas = await this.servi.getPaginas();

    const unixTime = Math.floor(new Date().getTime() / 1000);
    console.log(unixTime);
    const fechaLimite: Date = new Date(this.convertirUnixAFecha(unixTime));
    console.log(this.convertirUnixAFecha(unixTime));

    const querySnapshot = await getDocs(collection(this.fire.basededatos(), "Peticiones"));
    querySnapshot.forEach(async (docu) => {

      const fechaJuzgada:Date = new Date(this.fire.deletePeticiones(docu.data()));

      if(fechaJuzgada <= fechaLimite){
        console.log("Borrar");
        await deleteDoc(doc(this.fire.basededatos(), "Peticiones", docu.id));


      }

    });

    const borraTransportes = await getDocs(collection(this.fire.basededatos(), "Transportes"));
    borraTransportes.forEach(async (docu) => {

      const fechaJuzgada:Date = new Date(this.fire.deletePeticiones(docu.data()));

      if(fechaJuzgada <= fechaLimite){
        console.log("Borrar");
        await deleteDoc(doc(this.fire.basededatos(), "Transportes", docu.id));


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
