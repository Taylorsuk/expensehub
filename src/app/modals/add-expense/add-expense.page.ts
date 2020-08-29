import { Component, OnInit, Input } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ExpenseSaveData } from '../../interfaces/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ExpensesService } from 'src/app/services/expenses-service.service';
const { Camera } = Plugins;
import { CurrencyMaskConfig } from 'ngx-currency';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {
  @Input() expenseToEdit: ExpenseSaveData;
  expenseForm: FormGroup;
  expenseId: string;
  action: string = 'Create';
  currentExpense: ExpenseSaveData;
  currencyOptions: CurrencyMaskConfig = {
    prefix: '£',
    align: 'left',
    allowNegative: false,
    allowZero: false,
    decimal: '.',
    precision: 2,
    suffix: '',
    thousands: ',',
    nullable: false,
    min: null,
    max: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private captureService: CaptureService,
    private modalController: ModalController,
    public toastController: ToastController,
    private expensesService: ExpensesService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.action = this.expenseToEdit ? 'Edit' : 'Create';
    this.currentExpense = {
      id: this.generateUniqueId(),
      amount: 0,
      images: [],
      description: '',
      expenseDate: new Date().toISOString(),
      timeStamp: new Date().toISOString(),
      claimed: false,
      ...this.expenseToEdit,
    };

    this.expenseForm = this.formBuilder.group({
      amount: [this.currentExpense.amount, [Validators.required]],
      expenseDate: [this.currentExpense.expenseDate, [Validators.required]],
      description: [this.currentExpense.description],
      claimed: [this.currentExpense.claimed],
    });
  }

  async captureImage() {
    const expenseImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const base64Image = await this.captureService.readAsBase64(expenseImage);
    this.currentExpense.images.unshift(base64Image);
  }

  async saveExpense() {
    const expenseSaveData: ExpenseSaveData = {
      id: this.currentExpense.id,
      // id: '_tohody8sb',
      amount: this.expenseForm.value?.amount,
      images: [...this.currentExpense?.images],
      expenseDate: this.expenseForm.value?.expenseDate,
      description: this.expenseForm.value?.description || '',
      timeStamp: this.currentExpense?.timeStamp || new Date().toISOString(),
      claimed: this.expenseForm.value?.claimed,
    };

    if (!expenseSaveData.expenseDate) {
      return this.presentAlert('you must add an expense date');
    }
    if (!expenseSaveData.amount || expenseSaveData.amount === 0) {
      return this.presentAlert('You must enter a valid expense amount');
    }

    try {
      await this.createOrUpdateExpense(expenseSaveData);
      this.presentToast('Expense has been logged');
      this.modalController.dismiss();
    } catch (e) {
      console.error(e);
      this.presentToast(`Error: ${e}`);
    }
  }

  async createOrUpdateExpense(expense) {
    this.expensesService.createOrUpdateExpense(expense);
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

  deleteImage(position) {
    this.currentExpense.images.splice(position, 1);
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Invalid form',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
