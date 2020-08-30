import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddExpensePage } from '../modals/add-expense/add-expense.page';
import { IonRouterOutlet } from '@ionic/angular';
import { ExpensesService } from '../services/expenses-service.service';
import { Observable } from 'rxjs';
import { ExpenseSaveData } from '../interfaces/interfaces';

@Component({
  selector: 'expenses',
  templateUrl: 'expenses.page.html',
})

export class ExpensesPage {

  get CurrentExpenses(): Observable<ExpenseSaveData[]> {
    return this.expensesService.currentExpenses;
  }

  get CurrentExpenseTotal(): number {
    return this.expensesService?.currentExpenses?.value?.reduce((a, b) => a + b.amount, 0) || 0;
  }

  constructor(
    public modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private expensesService: ExpensesService,
    private alertController: AlertController
  ) {
    this.expensesService.loadCurrentExpenses();
  }

  async createOrEditExpense(expenseToEdit?) {
    const captureModal = await this.modalCtrl.create({
      component: AddExpensePage,
      swipeToClose: true,
      componentProps: { expenseToEdit: expenseToEdit } || {},
      presentingElement: this.routerOutlet.nativeEl,
    });

    await captureModal.present();
    captureModal
      .onWillDismiss()
      .then((dismissed) => {
        this.expensesService.loadCurrentExpenses();
      })
      .catch((e) => console.error(e));
  }

  async deleteExpense(expense, slidingItem) {
    const alert = await this.alertController.create({
      header: 'Delete Expense?',
      message: 'Are you sure you wish to delete this expense?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            return;
          },
        },
        {
          cssClass: 'danger',
          text: 'Delete',
          handler: () => {
            this.expensesService.deleteExpense(expense);
          },
        },
      ],
    });

    slidingItem.close();
    await alert.present();
  }

  editExpense(expense, slidingItem?) {
    slidingItem?.close();
    this.createOrEditExpense(expense);
  }

  filterExpenses(event) {
    this.expensesService.filterEvents(event?.detail?.value);
  }

  toggleClaimed(expense, slidingItem?) {
    slidingItem?.close();
    expense.claimed = !expense.claimed;
    this.expensesService.createOrUpdateExpense(expense);
  }
}
