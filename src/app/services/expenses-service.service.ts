import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {

  // BehaviorSubject chosen over Subject or Observable as it stored values in memory
  // shares data, bi-directional, replay the message stream and we can set an initial value
  // in this case an empty array. We do not need to create an observable of this as we will 
  // be using the async pipe in templates or getting static values for updating
  currentExpenses = new BehaviorSubject([]);

  constructor() { }

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
