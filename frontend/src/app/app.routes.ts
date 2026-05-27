import { Routes } from '@angular/router';
import { BuilderComponent } from './features/builder/builder.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderSuccessComponent } from './features/order-success/order-success.component';

export const routes: Routes = [
  { path: '', component: BuilderComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success/:id', component: OrderSuccessComponent },
  { path: '**', redirectTo: '' }
];
迫