import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseSaveData } from '../interfaces/interfaces';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  currentExpenses = new BehaviorSubject([]);

  constructor() {}

  async loadCurrentExpenses() {
    const ret = await Storage.get({ key: 'expenses' });
    this.currentExpenses.next(JSON.parse(ret.value));
  }

  async deleteExpense(expense) {
    const currentValues = this.currentExpenses.getValue();
    const elementsIndex = currentValues.findIndex((element) => element.id === expense.id);
    currentValues.splice(elementsIndex, 1);
    this.setObject('expenses', currentValues);
  }

  async setObject(key, expenseArray) {
    await Storage.set({
      key: key,
      value: JSON.stringify(expenseArray),
    });
    return this.loadCurrentExpenses();
  }

  async getFromStorage(key) {
    const ret = await Storage.get({ key: key });
    return JSON.parse(ret.value);
  }

  filterEvents(term) {
    if (!term) {
      this.loadCurrentExpenses();
    }
    const filterList = this.currentExpenses.value.filter((expense) => {
      if (expense.description && term) {
        return expense.description.toLowerCase().indexOf(term.toLowerCase()) > -1;
      }
    });
    this.currentExpenses.next(filterList);
  }

  async createOrUpdateExpense(expense) {
    // This is a non-scalable way of storing this data. A full Read of all expenses followed
    // by updating / adding a value is not ideal, however remains performant for a this mvp.
    // we need to implement a backend solution before this could be released to prod especially as
    // we aim for a better solution to image storage than base64.
    const savedExpenses = (await this.getFromStorage('expenses')) || [];
    const elementsIndex = savedExpenses.findIndex((element) => element.id === expense.id);

    let newSaveArray = [...savedExpenses];
    if (elementsIndex > -1) {
      newSaveArray[elementsIndex] = { ...expense };
    } else {
      newSaveArray.unshift(expense);
    }
    return this.setObject('expenses', newSaveArray);
  }
}
