import { Routes } from '@angular/router';
import { Booking } from './features/booking/booking';
import { Inicio } from './features/landing/inicio/inicio';

export const routes: Routes = [
    {
        path: '',
        component: Inicio,
        pathMatch: 'full'
    },
    {
        path: 'reservas',
        component: Booking
    }
];