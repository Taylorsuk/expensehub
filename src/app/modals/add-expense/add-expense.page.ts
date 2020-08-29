import { Component, OnInit, Input } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { ModalController, ToastController } from '@ionic/angular';
import { ExpenseImage, ExpenseSaveData } from "../../interfaces/interfaces";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource
} from '@capacitor/core';
import { ExpensesService } from 'src/app/services/expenses-service.service';

const { Camera, Filesystem, Storage } = Plugins;

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {

  @Input() expenseToEdit: ExpenseSaveData;
  expenseForm: FormGroup;
  expenseId: string;
  currentExpense: ExpenseSaveData;
  currencyOptions = {
    prefix: '£'
  }

  constructor(
    private formBuilder: FormBuilder,
    private captureService: CaptureService,
    private modalController: ModalController,
    public toastController: ToastController,
    private expensesService: ExpensesService,
  ) {

  }

  ngOnInit() {

    console.log(this.expenseToEdit);

    this.currentExpense = {
      id: this.generateUniqueId(),
      amount: 0,
      images: [],
      description: '',
      expenseDate: new Date().toISOString(),
      timeStamp: new Date().toISOString(),
      ...this.expenseToEdit,
    };

    this.expenseForm = this.formBuilder.group({
      amount: [this.currentExpense.amount, [Validators.required]],
      expenseDate: [this.currentExpense.expenseDate, [Validators.required]],
      description: [this.currentExpense.description],
    });
  }

  async captureImage() {
    const expenseImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,

    });

    const base64Image = await this.captureService.readAsBase64(expenseImage)
    this.currentExpense.images.unshift(base64Image);

    console.log(this.currentExpense);

  }

  async saveExpense() {

    const expenseSaveData: ExpenseSaveData = {
      id: this.currentExpense.id,
      // id: '_tohody8sb',
      amount: this.expenseForm.value?.amount,
      images: [...this.currentExpense?.images],
      expenseDate: this.expenseForm.value?.expenseDate,
      description: this.expenseForm.value?.description || '',
      timeStamp: this.currentExpense?.timeStamp || new Date().toISOString()
    }

    try {
      await this.createOrUpdateExpense(expenseSaveData)
      this.presentToast('Expense has been logged');
      this.modalController.dismiss();
    } catch (e) {
      console.error(e)
      this.presentToast(`Error: ${e}`)
    }
  }

  async createOrUpdateExpense(expense) {
    console.log(expense);
    // This is a non-scalable way of storing this data. A full Read of all expenses followed
    // by updating / adding a value is not ideal, however remains performant for a this mvp. 
    // we need to implement a backend solution before this could be released to prod especially as
    // we aim for a better solution to image storage than base64. 
    const savedExpenses = await this.expensesService.getFromStorage('expenses') || [];
    const elementsIndex = savedExpenses.findIndex(element => element.id === expense.id);

    let newSaveArray = [...savedExpenses]
    if (elementsIndex > -1) {
      newSaveArray[elementsIndex] = { ...expense }
    } else {
      newSaveArray.unshift(expense);
    }
    return this.expensesService.setObject('expenses', newSaveArray);
  }

  generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }

}
