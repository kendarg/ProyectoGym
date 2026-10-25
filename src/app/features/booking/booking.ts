import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { entrenadores, fisioterapeutas } from './booking.data';

interface ReservaTemporal {
    tipoAtencion: 'coach' | 'fisio';
    profesionalId: number;
    profesionalNombre: string;
    fecha: string;
    hora: string;
    duracion: number;
}

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
    fisioterapeutas = fisioterapeutas;
    fechaReserva = '';
    horaReserva = '';
    horasDisponibles: string[] = [];
    reservasTemporales: ReservaTemporal[] = [];
    mensajeConfirmacion = '';
    fechaMinima = new Date().toLocaleDateString('en-CA');
    confirmarReserva(): boolean {
        if (this.tipoAtencion === 'coach') {
            const entrenador = this.obtenerEntrenadorSeleccionado();

            if (!entrenador || !this.fechaReserva || !this.validarDiaEntrenador()
                || !this.validarHoraEntrenador() || this.horarioOcupado(this.horaReserva)) {
                this.mensajeConfirmacion =
                    'Verifica el entrenador, la fecha y la disponibilidad del horario.';
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'coach',
                profesionalId: entrenador.id,
                profesionalNombre: entrenador.nombre,
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: entrenador.duracionSesion
            });
        }
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
            (this.tipoAtencion === 'coach' ? ` Entrenador: ${nombreEntrenador}` : '');
        return true;
    }
    obtenerEntrenadorSeleccionado() {
        return this.entrenadores.find(
            entrenador => entrenador.id === Number(this.entrenadorSeleccionado)
        );
    }

    obtenerFisioterapeutaDisponible() {
        if (!this.fechaReserva || !this.horaReserva) {
            return undefined;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = [
            'domingo', 'lunes', 'martes', 'miercoles',
            'jueves', 'viernes', 'sabado'
        ];
        const diaSeleccionado = diasSemana[fecha.getDay()];

        const [hora, minutos] = this.horaReserva.split(':').map(Number);
        const inicioNuevo = hora * 60 + minutos;

        return this.fisioterapeutas.find(fisio => {
            if (!fisio.dias.includes(diaSeleccionado)) {
                return false;
            }

            const [inicioHora, inicioMinutos] = fisio.horaInicio.split(':').map(Number);
            const inicioJornada = inicioHora * 60 + inicioMinutos;

            const [finHora, finMinutos] = fisio.horaFin.split(':').map(Number);
            const finJornada = finHora * 60 + finMinutos;

            const finNuevo = inicioNuevo + fisio.duracionSesion;

            if (inicioNuevo < inicioJornada || finNuevo > finJornada) {
                return false;
            }

            return !this.reservasTemporales.some(reserva => {
                if (
                    reserva.tipoAtencion !== 'fisio' ||
                    reserva.profesionalId !== fisio.id ||
                    reserva.fecha !== this.fechaReserva
                ) {
                    return false;
                }

                const [horaExistente, minutosExistentes] =
                    reserva.hora.split(':').map(Number);

                const inicioExistente = horaExistente * 60 + minutosExistentes;
                const finExistente = inicioExistente + reserva.duracion;

                return inicioNuevo < finExistente &&
                    finNuevo > inicioExistente;
            });
        });
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

            const horaDisponible = `${hora}:${minuto}`;

            if (!this.horarioOcupado(horaDisponible)) {
                horas.push(horaDisponible);
            }
        }

        return horas;
    }

    horarioOcupado(hora: string): boolean {
        const entrenador = this.obtenerEntrenadorSeleccionado();

        if (!entrenador || !this.fechaReserva) {
            return false;
        }

        const [horaInicio, minutoInicio] = hora.split(':').map(Number);
        const inicioNuevo = horaInicio * 60 + minutoInicio;
        const finNuevo = inicioNuevo + entrenador.duracionSesion;

        return this.reservasTemporales.some(reserva => {
            if (
                reserva.tipoAtencion !== 'coach' ||
                reserva.profesionalId !== entrenador.id ||
                reserva.fecha !== this.fechaReserva
            ) {
                return false;
            }

            const [horaReserva, minutoReserva] = reserva.hora.split(':').map(Number);
            const inicioExistente = horaReserva * 60 + minutoReserva;
            const finExistente = inicioExistente + reserva.duracion;

            return inicioNuevo < finExistente &&
                finNuevo > inicioExistente;
        });
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