import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddExpensePageRoutingModule } from './add-expense-routing.module';
import { AddExpensePage } from './add-expense.page';
import { SharedComponentsModule } from "../../components/components.module";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AddExpensePageRoutingModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
  ],
  declarations: [AddExpensePage]
})
export class AddExpensePageModule { }
