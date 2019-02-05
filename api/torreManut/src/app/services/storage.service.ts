import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Item {
  usuario_id: number,
  nome: string,
  sobrenome: string,
  funcao: string,
  especialidade: string,
  atuacao: string,
  email: string,
  senha: string,
  admin: string,
  ativo: string
}

const ITEMS_KEY = 'my-items';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage) { }

  // Create
  addItem(item: Item): Promise<any> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(ITEMS_KEY, [item]);
      } else {
        return this.storage.set(ITEMS_KEY, [item]);
      }
    });
  }

  // Read
  getItem(item: Item) {
    return this.storage.get(ITEMS_KEY);
  }

  // Update
  updateItem(item: Item) {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      } 

        let newItems: Item[] = [];

        for (let i of items) {
          if (i.usuario_id === item.usuario_id) {
            newItems.push(item);
          } else {
            newItems.push(i);
          }
        }
        return this.storage.set(ITEMS_KEY, newItems);

    });
  }

  // Delete
  deleteItem(id: number): Promise<Item> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      } 

        let toKeep: Item[] = [];

        for (let i of items) {
          if (i.usuario_id === id) {
            toKeep.push(i);
          } 
        }
      return this.storage.set(ITEMS_KEY,toKeep);
    });
  }

}
