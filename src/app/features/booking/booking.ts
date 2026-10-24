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
    horasDisponibles: string[] = [];
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
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaSeleccionado = diasSemana[fecha.getDay()];

        return entrenador.dias.includes(diaSeleccionado);
    }
    validarHoraEntrenador(): boolean {
        const entrenador = this.obtenerEntrenadorSeleccionado();
        if (!entrenador || !this.horaReserva) {
            return false;
        }

        const [hora, minutos] = this.horaReserva.split(':').map(Number);
        const minutosSeleccionados = hora * 60 + minutos;

        const [inicioHora, inicioMinutos] = entrenador.horaInicio.split(':').map(Number);
        const inicio = inicioHora * 60 + inicioMinutos;

        const [finHora, finMinutos] = entrenador.horaFin.split(':').map(Number);
        const fin = finHora * 60 + finMinutos;

        return minutosSeleccionados >= inicio &&
            minutosSeleccionados + entrenador.duracionSesion <= fin &&
            minutosSeleccionados % entrenador.duracionSesion === 0;
    }
    generarHorasDisponibles(): string[] {
        const entrenador = this.obtenerEntrenadorSeleccionado();
        if (!entrenador || !this.fechaReserva || !this.validarDiaEntrenador()) {
            return [];
        }

        const horas: string[] = [];
        const [inicioHora, inicioMinutos] = entrenador.horaInicio.split(':').map(Number);
        const [finHora, finMinutos] = entrenador.horaFin.split(':').map(Number);

        const inicio = inicioHora * 60 + inicioMinutos;
        const fin = finHora * 60 + finMinutos;

        for (
            let minutos = inicio;
            minutos + entrenador.duracionSesion <= fin;
            minutos += entrenador.duracionSesion
        ) {
            const hora = Math.floor(minutos / 60).toString().padStart(2, '0');
            const minuto = (minutos % 60).toString().padStart(2, '0');

            horas.push(`${hora}:${minuto}`);
        }

        return horas;
    }
    limpiarConfirmacion() {
        this.mensajeConfirmacion = '';
    }
    limpiarFormulario() {
        this.entrenadorSeleccionado = '';
        this.fechaReserva = '';
        this.horaReserva = '';
        this.limpiarConfirmacion();
    }
    limpiarSeleccionHorario() {
        this.fechaReserva = '';
        this.horaReserva = '';
        this.horasDisponibles = [];
        this.limpiarConfirmacion();
    }
    limpiarSeleccionFecha() {
        this.horaReserva = '';
        this.limpiarConfirmacion();
    }
}