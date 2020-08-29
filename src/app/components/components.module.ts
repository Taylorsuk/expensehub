import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Components
import { CurrencyInputComponent } from './currency-input/currency-input.component';

@NgModule({
    declarations: [CurrencyInputComponent],
    entryComponents: [CurrencyInputComponent],
    imports: [CommonModule, IonicModule],
    exports: [CurrencyInputComponent],
})
export class SharedComponentsModule { }
