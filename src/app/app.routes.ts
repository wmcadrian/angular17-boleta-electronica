import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/principal/main/main').then(m => m.Main)
  }
];
