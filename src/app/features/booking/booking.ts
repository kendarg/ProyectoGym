import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
    selector:'app-booking',
    imports: [FormsModule],
    templateUrl:'./booking.html',
    styleUrl:'./booking.css',
})
export class Booking{
    tipoAtencion = '';
    fechaReserva = '';
    horaReserva = '';
}