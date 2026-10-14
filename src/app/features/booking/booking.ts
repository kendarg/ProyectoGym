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
    modalAbierto = false;
    fechaReserva = '';
    horaReserva = '';
    mensajeConfirmacion = '';
    fechaMinima = new Date().toLocaleDateString('en-CA');
    confirmarReserva() {
        this.mensajeConfirmacion =
            `Reserva preparada correctamente para ${this.tipoAtencion}. ` +
            `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}.`;
    }
    limpiarConfirmacion() {
        this.mensajeConfirmacion = '';
    }
}