import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {DefaultLayoutComponent} from './layouts/default-layout/default-layout.component';
import { ExampleComponent } from './components/example/example.component';

export const routes: Routes = [
  { path: '', component: DefaultLayoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'example', component: ExampleComponent }
];
