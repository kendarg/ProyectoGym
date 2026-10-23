import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { entrenadores } from './booking.data';

@Component({
    selector: 'app-booking',
    imports: [FormsModule],
    templateUrl: './booking.html',
    styleUrl: './booking.css',
})
export class Booking {
    tipoAtencion = '';
    modalAbierto = false;
    entrenadorSeleccionado = '';
    entrenadores = entrenadores;
    fechaReserva = '';
    horaReserva = '';
    mensajeConfirmacion = '';
    fechaMinima = new Date().toLocaleDateString('en-CA');
    confirmarReserva() {
        let nombreEntrenador = '';
        if (this.tipoAtencion === 'coach') {
            const entrenador = this.entrenadores.find(
                entrenador => entrenador.id === Number(this.entrenadorSeleccionado)
            );
            nombreEntrenador = entrenador?.nombre ?? '';
        }
        this.mensajeConfirmacion =
            `Reserva preparada correctamente para ${this.tipoAtencion}. ` +
            `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}.` +
            (this.tipoAtencion === 'coach'
                ? ` Entrenador: ${nombreEntrenador}`
                : '');
    }
    obtenerEntrenadorSeleccionado() {
        return this.entrenadores.find(
            entrenador => entrenador.id === Number(this.entrenadorSeleccionado)
        );
    }

    validarDiaEntrenador(): boolean {
        const entrenador = this.obtenerEntrenadorSeleccionado();

        if (!entrenador || !this.fechaReserva) {
            return false;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = [
            'domingo',
            'lunes',
            'martes',
            'miercoles',
            'jueves',
            'viernes',
            'sabado'
        ];

        const diaSeleccionado = diasSemana[fecha.getDay()];

        return entrenador.dias.includes(diaSeleccionado);
    }

    limpiarConfirmacion() {
        this.mensajeConfirmacion = '';
    }
}