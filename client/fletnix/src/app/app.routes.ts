// src/app/app.routes.ts
import { RegisterComponent } from './register/register.component';

export const routes = [
  { path: 'register', loadComponent: () => RegisterComponent },
  { path: '**', redirectTo: '/' }
];
