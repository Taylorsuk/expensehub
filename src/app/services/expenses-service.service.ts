import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseSaveData } from "../interfaces/interfaces";
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  currentExpenses = new BehaviorSubject([]);

  constructor() { }


  async loadCurrentExpenses() {
    const ret = await Storage.get({ key: 'expenses' });
    this.currentExpenses.next(JSON.parse(ret.value));
  }

  async deleteExpense(expense) {
    const currentValues = this.currentExpenses.getValue();
    const elementsIndex = currentValues.findIndex(element => element.id === expense.id);
    currentValues.splice(elementsIndex, 1);
    this.setObject('expenses', currentValues)
  }

  async setObject(key, expenseArray) {
    await Storage.set({
      key: key,
      value: JSON.stringify(expenseArray)
    });
    return this.loadCurrentExpenses();
  }

  async getFromStorage(key) {
    const ret = await Storage.get({ key: key });
    return JSON.parse(ret.value);
  }

}
