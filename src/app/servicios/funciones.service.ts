import { Injectable } from '@angular/core';
import paginas from '../../assets/paginas.json'

import emojis from '../../assets/emojis.json'
import { get, getDatabase, ref, remove } from 'firebase/database';
import { deleteField, doc, updateDoc } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  constructor(
    private fire:FirebaseService
  ) { }
  private db = getDatabase();

  getPaginas(){
    return paginas;
  }

  getEmojis(){
    return emojis;
  }


  async borrarChats(uid:any){
    let userRef = await doc(this.fire.basededatos(), "Usuarios", "Usuario-"+uid);

    let Usuario = await this.fire.getUserByUID(uid);

    if(Usuario.otrosChats){
      for(let i = 0; i < Usuario.otrosChats.length; i++){
        console.log(Usuario.otrosChats[i]);
        this.db = await getDatabase();
        let sala1:any = await ref(this.db, 'Sala-' + uid + '-' + Usuario.otrosChats[i]);

        let sala2:any = await ref(this.db, 'Sala-' + Usuario.otrosChats[i] + '-' + uid);

        get(sala1).then(async (snapshot) => {
          if (snapshot.exists()) {
            remove(sala1);
          } else {
            remove(sala2)
          }
        }).catch((error) => {
          console.error(error);
        });
      }

      await updateDoc(userRef, {
        otrosChats: deleteField()
      });
    }
  }
}
