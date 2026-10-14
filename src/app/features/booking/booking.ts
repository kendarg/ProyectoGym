import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-booking',
    imports: [FormsModule],
    templateUrl: './booking.html',
    styleUrl: './booking.css',
})
export class Booking {
    tipoAtencion = '';
    fechaReserva = '';
    horaReserva = '';
    fechaMinima = new Date().toLocaleDateString('en-CA');
    confirmarReserva() {
        console.log('Reserva preparada:', {
            tipoAtencion: this.tipoAtencion,
            fecha: this.fechaReserva,
            hora: this.horaReserva
        });
    }
}