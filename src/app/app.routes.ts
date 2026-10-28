import { Routes } from '@angular/router';
import { Inicio } from './features/landing/inicio/inicio';
import { Booking } from './features/booking/booking';
import { Shop } from './features/shop/shop';

export const routes: Routes = [
    {
        path: '',
        component: Inicio,
        pathMatch: 'full'
    },
    {
        path: 'reservas',
        component: Booking
    },
    {
        path: 'tienda',
        component: Shop
    }
];