import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { entrenadores, fisioterapeutas, nutricionistas, sauna, zumba, entrenadoresBox, box } from './booking.data';
import { Qr } from "./qr/qr";

interface ReservaTemporal {
    tipoAtencion: 'coach' | 'fisio' | 'fit-diet' | 'sauna' | 'zumba' | 'box';
    profesionalId: number;
    profesionalNombre: string;
    fecha: string;
    hora: string;
    duracion: number;
    modalidadBox?: 'grupal' | 'individual';
}

@Component({
    selector: 'app-booking',
    imports: [FormsModule, Qr],
    templateUrl: './booking.html',
    styleUrl: './booking.css',
})
export class Booking {
    tipoAtencion = '';
    modalAbierto = false;
    entrenadorSeleccionado = '';
    nutricionistaSeleccionado = '';
    entrenadores = entrenadores;
    fisioterapeutas = fisioterapeutas;
    nutricionistas = nutricionistas;
    sauna = sauna;
    zumba = zumba;
    entrenadoresBox = entrenadoresBox;
    box = box;
    modalidadBox: 'grupal' | 'individual' = 'grupal';
    entrenadorBoxSeleccionado = '';
    fechaReserva = '';
    horaReserva = '';
    horasDisponibles: string[] = [];
    private readonly claveReservas = 'gym_reservas';
    reservasTemporales: ReservaTemporal[] = [];
    mensajeConfirmacion = '';
    fechaMinima = new Date().toLocaleDateString('en-CA');

    confirmarReserva(): boolean {
        if (this.tipoAtencion === 'coach') {
            const entrenador = this.obtenerEntrenadorSeleccionado();

            if (
                !entrenador ||
                !this.fechaReserva ||
                !this.validarDiaEntrenador() ||
                !this.validarHoraEntrenador() ||
                this.horarioOcupado(this.horaReserva)
            ) {
                this.mensajeConfirmacion =
                    'Verifica el entrenador, la fecha y la disponibilidad del horario.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
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
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva preparada correctamente para Coach. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Entrenador: ${entrenador.nombre}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }

        if (this.tipoAtencion === 'fisio') {
            const fisioterapeuta = this.obtenerFisioterapeutaDisponible();

            if (!fisioterapeuta) {
                this.mensajeConfirmacion =
                    'No hay fisioterapeutas disponibles para esa fecha y hora. Selecciona otro horario.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'fisio',
                profesionalId: fisioterapeuta.id,
                profesionalNombre: fisioterapeuta.nombre,
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: fisioterapeuta.duracionSesion
            });
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva preparada correctamente para Fisio. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Fisioterapeuta asignado: ${fisioterapeuta.nombre}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }

        if (this.tipoAtencion === 'fit-diet') {
            const nutricionista = this.obtenerNutricionistaSeleccionado();

            if (
                !nutricionista ||
                !this.fechaReserva ||
                !this.validarDiaNutricionista() ||
                !this.validarHoraNutricionista() ||
                this.horarioNutricionistaOcupado(this.horaReserva)
            ) {
                this.mensajeConfirmacion =
                    'Verifica el nutricionista, la fecha y la disponibilidad del horario.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'fit-diet',
                profesionalId: nutricionista.id,
                profesionalNombre: nutricionista.nombre,
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: nutricionista.duracionSesion
            });
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva preparada correctamente para Fit-Diet. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Nutricionista: ${nutricionista.nombre}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }
        if (this.tipoAtencion === 'sauna') {
            if (
                !this.fechaReserva ||
                !this.validarDiaSauna() ||
                !this.horaReserva ||
                !this.generarTurnosSauna().includes(this.horaReserva) ||
                this.cuposDisponiblesSauna(this.horaReserva) <= 0
            ) {
                this.mensajeConfirmacion =
                    'Verifica la fecha, el turno y los cupos disponibles para Sauna.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'sauna',
                profesionalId: 0,
                profesionalNombre: 'Sauna',
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: this.sauna.duracionTurno
            });
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva preparada correctamente para Sauna. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Cupos restantes: ${this.cuposDisponiblesSauna(this.horaReserva)}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }

        if (this.tipoAtencion === 'zumba') {
            if (
                !this.fechaReserva ||
                !this.validarDiaZumba() ||
                !this.horaReserva ||
                !this.generarClasesZumba().includes(this.horaReserva) ||
                this.cuposDisponiblesZumba(this.horaReserva) <= 0
            ) {
                this.mensajeConfirmacion =
                    'Verifica la fecha, la clase y los cupos disponibles para Zumba.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'zumba',
                profesionalId: 0,
                profesionalNombre: 'Instructor de Zumba',
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: this.zumba.duracionClase
            });
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva preparada correctamente para Zumba. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Cupos restantes: ${this.cuposDisponiblesZumba(this.horaReserva)}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }

        if (this.tipoAtencion === 'box') {
            if (
                !this.fechaReserva ||
                !this.validarDiaBox() ||
                !this.horaReserva ||
                !this.generarHorariosBox().includes(this.horaReserva)
            ) {
                this.mensajeConfirmacion =
                    'Verifica la fecha, la modalidad y el horario disponible para Box.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            const reservasHorario = this.reservasTemporales.filter(
                reserva =>
                    reserva.tipoAtencion === 'box' &&
                    reserva.fecha === this.fechaReserva &&
                    reserva.hora === this.horaReserva
            );

            if (this.modalidadBox === 'grupal') {
                if (this.cuposDisponiblesBox(this.horaReserva) <= 0) {
                    this.mensajeConfirmacion =
                        'La clase grupal ya alcanzó su capacidad máxima.';
                        this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                    return false;
                }

                const claseExistente = reservasHorario.find(
                    reserva => reserva.modalidadBox === 'grupal'
                );

                const entrenador = claseExistente
                    ? this.entrenadoresBox.find(
                        item => item.id === claseExistente.profesionalId
                    )
                    : this.obtenerEntrenadorBoxDisponible();

                if (!entrenador) {
                    this.mensajeConfirmacion =
                        'No hay entrenadores disponibles para esa clase.';
                        this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                    return false;
                }

                this.reservasTemporales.push({
                    tipoAtencion: 'box',
                    modalidadBox: 'grupal',
                    profesionalId: entrenador.id,
                    profesionalNombre: entrenador.nombre,
                    fecha: this.fechaReserva,
                    hora: this.horaReserva,
                    duracion: this.box.duracionSesion
                });
                this.guardarReservas();
                this.mensajeConfirmacion =
                    `Reserva grupal de Box preparada correctamente. ` +
                    `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                    `Entrenador: ${entrenador.nombre}. ` +
                    `Cupos restantes: ${this.cuposDisponiblesBox(this.horaReserva)}`;
                this.mostrarAlerta(this.mensajeConfirmacion, 'success');
                return true;
            }

            const entrenador = this.entrenadoresBox.find(
                item => item.id === Number(this.entrenadorBoxSeleccionado)
            );

            if (
                !entrenador ||
                this.entrenadorBoxOcupado(
                    entrenador.id,
                    this.horaReserva
                )
            ) {
                this.mensajeConfirmacion =
                    'El entrenador seleccionado no está disponible en ese horario.';
                this.mostrarAlerta(this.mensajeConfirmacion, 'error');
                return false;
            }

            this.reservasTemporales.push({
                tipoAtencion: 'box',
                modalidadBox: 'individual',
                profesionalId: entrenador.id,
                profesionalNombre: entrenador.nombre,
                fecha: this.fechaReserva,
                hora: this.horaReserva,
                duracion: this.box.duracionSesion
            });
            this.guardarReservas();
            this.mensajeConfirmacion =
                `Reserva individual de Box preparada correctamente. ` +
                `Fecha: ${this.fechaReserva}. Hora: ${this.horaReserva}. ` +
                `Entrenador: ${entrenador.nombre}`;
            this.mostrarAlerta(this.mensajeConfirmacion, 'success');
            return true;
        }

        this.mensajeConfirmacion =
            'Este tipo de atención todavía no tiene habilitada la confirmación de reservas.';
        this.mostrarAlerta(this.mensajeConfirmacion, 'error');
        return false;
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

    obtenerFisioterapeutaDisponible() {
        if (!this.fechaReserva || !this.horaReserva) {
            return undefined;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
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

                const [horaExistente, minutosExistentes] = reserva.hora.split(':').map(Number);

                const inicioExistente = horaExistente * 60 + minutosExistentes;
                const finExistente = inicioExistente + reserva.duracion;
                return inicioNuevo < finExistente && finNuevo > inicioExistente;
            });
        });
    }

    obtenerNutricionistaSeleccionado() {
        return this.nutricionistas.find(
            nutricionista => nutricionista.id === Number(this.nutricionistaSeleccionado));
    }

    validarDiaNutricionista(): boolean {
        const nutricionista = this.obtenerNutricionistaSeleccionado();

        if (!nutricionista || !this.fechaReserva) {
            return false;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

        const diaSeleccionado = diasSemana[fecha.getDay()];
        return nutricionista.dias.includes(diaSeleccionado);
    }

    validarHoraNutricionista(): boolean {
        const nutricionista = this.obtenerNutricionistaSeleccionado();

        if (!nutricionista || !this.horaReserva) {
            return false;
        }

        const [hora, minutos] = this.horaReserva.split(':').map(Number);
        const minutosSeleccionados = hora * 60 + minutos;

        const [inicioHora, inicioMinutos] = nutricionista.horaInicio.split(':').map(Number);
        const inicio = inicioHora * 60 + inicioMinutos;

        const [finHora, finMinutos] = nutricionista.horaFin.split(':').map(Number);
        const fin = finHora * 60 + finMinutos;

        return minutosSeleccionados >= inicio &&
            minutosSeleccionados + nutricionista.duracionSesion <= fin &&
            (minutosSeleccionados - inicio) % nutricionista.duracionSesion === 0;
    }

    generarHorasNutricionista(): string[] {
        const nutricionista = this.obtenerNutricionistaSeleccionado();

        if (!nutricionista || !this.fechaReserva || !this.validarDiaNutricionista()) {
            return [];
        }

        const horas: string[] = [];

        const [inicioHora, inicioMinutos] = nutricionista.horaInicio.split(':').map(Number);

        const [finHora, finMinutos] = nutricionista.horaFin.split(':').map(Number);

        const inicio = inicioHora * 60 + inicioMinutos;
        const fin = finHora * 60 + finMinutos;

        for (let minutos = inicio; minutos + nutricionista.duracionSesion
            <= fin; minutos += nutricionista.duracionSesion) {
            const hora = Math.floor(minutos / 60).toString().padStart(2, '0');

            const minuto = (minutos % 60).toString().padStart(2, '0');
            const horaDisponible = `${hora}:${minuto}`;

            if (!this.horarioNutricionistaOcupado(horaDisponible)) {
                horas.push(horaDisponible);
            }
        }

        return horas;
    }

    horarioNutricionistaOcupado(hora: string): boolean {
        const nutricionista = this.obtenerNutricionistaSeleccionado();

        if (!nutricionista || !this.fechaReserva) {
            return false;
        }

        const [horaInicio, minutoInicio] = hora.split(':').map(Number);
        const inicioNuevo = horaInicio * 60 + minutoInicio;
        const finNuevo = inicioNuevo + nutricionista.duracionSesion;

        return this.reservasTemporales.some(reserva => {
            if (reserva.tipoAtencion !== 'fit-diet' ||
                reserva.profesionalId !== nutricionista.id ||
                reserva.fecha !== this.fechaReserva) {
                return false;
            }

            const [horaReserva, minutoReserva] = reserva.hora.split(':').map(Number);

            const inicioExistente = horaReserva * 60 + minutoReserva;
            const finExistente = inicioExistente + reserva.duracion;

            return inicioNuevo < finExistente && finNuevo > inicioExistente;
        });
    }

    validarDiaSauna(): boolean {
        if (!this.fechaReserva) {
            return false;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        return this.sauna.dias.includes(diasSemana[fecha.getDay()]);
    }

    generarTurnosSauna(): string[] {
        if (!this.fechaReserva || !this.validarDiaSauna()) {
            return [];
        }
        const turnos: string[] = [];

        for (const horario of this.sauna.horarios) {
            const [horaInicio, minutosInicio] = horario.inicio.split(':').map(Number);
            const [horaFin, minutosFin] = horario.fin.split(':').map(Number);

            const inicio = horaInicio * 60 + minutosInicio;
            const fin = horaFin * 60 + minutosFin;

            for (let minutos = inicio; minutos + this.sauna.duracionTurno <= fin;
                minutos += this.sauna.duracionTurno
            ) {
                const hora = Math.floor(minutos / 60).toString().padStart(2, '0');
                const minuto = (minutos % 60).toString().padStart(2, '0');
                const turno = `${hora}:${minuto}`;

                if (this.cuposDisponiblesSauna(turno) > 0) {
                    turnos.push(turno);
                }
            }
        }

        return turnos;
    }

    cuposDisponiblesSauna(turno: string): number {
        const reservas = this.reservasTemporales.filter(reserva =>
            reserva.tipoAtencion === 'sauna' &&
            reserva.fecha === this.fechaReserva &&
            reserva.hora === turno).length;

        return Math.max(0, this.sauna.capacidadPorTurno - reservas);
    }

    validarDiaZumba(): boolean {
        if (!this.fechaReserva) {
            return false;
        }

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const diasSemana = [
            'domingo', 'lunes', 'martes', 'miercoles',
            'jueves', 'viernes', 'sabado'
        ];

        return this.zumba.dias.includes(diasSemana[fecha.getDay()]);
    }

    generarClasesZumba(): string[] {
        if (!this.fechaReserva || !this.validarDiaZumba()) {
            return [];
        }

        const clases: string[] = [];

        for (const horario of this.zumba.horarios) {
            const [horaInicio, minutosInicio] = horario.inicio.split(':').map(Number);
            const [horaFin, minutosFin] = horario.fin.split(':').map(Number);

            const inicio = horaInicio * 60 + minutosInicio;
            const fin = horaFin * 60 + minutosFin;
            const duracionTotal = this.zumba.duracionClase + this.zumba.descansoInstructor;

            for (
                let minutos = inicio;
                minutos + this.zumba.duracionClase <= fin;
                minutos += duracionTotal
            ) {
                const hora = Math.floor(minutos / 60).toString().padStart(2, '0');
                const minuto = (minutos % 60).toString().padStart(2, '0');
                const clase = `${hora}:${minuto}`;

                if (this.cuposDisponiblesZumba(clase) > 0) {
                    clases.push(clase);
                }
            }
        }

        return clases;
    }

    cuposDisponiblesZumba(hora: string): number {
        const reservas = this.reservasTemporales.filter(reserva =>
            reserva.tipoAtencion === 'zumba' &&
            reserva.fecha === this.fechaReserva &&
            reserva.hora === hora
        ).length;

        return Math.max(0, this.zumba.capacidadPorClase - reservas);
    }

    validarDiaBox(): boolean {
        if (!this.fechaReserva) return false;

        const fecha = new Date(this.fechaReserva + 'T12:00:00');
        const dias = [
            'domingo', 'lunes', 'martes', 'miercoles',
            'jueves', 'viernes', 'sabado'
        ];
        const dia = dias[fecha.getDay()];

        return this.modalidadBox === 'grupal'
            ? this.box.diasGrupales.includes(dia)
            : this.box.diasIndividuales.includes(dia);
    }

    generarHorariosBox(): string[] {
        if (!this.fechaReserva || !this.validarDiaBox()) {
            return [];
        }

        const horario = this.modalidadBox === 'grupal' ? this.box.horarioGrupal : this.box.horarioIndividual;

        const [inicioH, inicioM] = horario.inicio.split(':').map(Number);
        const [finH, finM] = horario.fin.split(':').map(Number);
        const inicio = inicioH * 60 + inicioM;
        const fin = finH * 60 + finM;
        const horas: string[] = [];

        for (
            let minutos = inicio;
            minutos + this.box.duracionSesion <= fin;
            minutos += 60
        ) {
            const hora = `${Math.floor(minutos / 60)
                .toString().padStart(2, '0')}:${(minutos % 60)
                    .toString().padStart(2, '0')}`;

            if (this.modalidadBox === 'grupal') {
                if (this.cuposDisponiblesBox(hora) > 0 &&
                    (this.entrenadorBoxDeClase(hora) ||
                        this.obtenerEntrenadorBoxDisponible(hora))) {
                    horas.push(hora);
                }
            } else {
                const entrenadorId = Number(this.entrenadorBoxSeleccionado);

                if (
                    this.entrenadorBoxSeleccionado &&
                    !this.entrenadorBoxOcupado(entrenadorId, hora)
                ) {
                    horas.push(hora);
                }
            }
        }
        return horas;
    }

    cuposDisponiblesBox(hora: string): number {
        const ocupadas = this.reservasTemporales.filter(
            reserva =>
                reserva.tipoAtencion === 'box' &&
                reserva.modalidadBox === 'grupal' &&
                reserva.fecha === this.fechaReserva &&
                reserva.hora === hora
        ).length;

        return Math.max(0, this.box.capacidadGrupal - ocupadas);
    }

    entrenadorBoxDeClase(hora: string) {
        const reserva = this.reservasTemporales.find(
            item =>
                item.tipoAtencion === 'box' &&
                item.modalidadBox === 'grupal' &&
                item.fecha === this.fechaReserva &&
                item.hora === hora
        );

        return this.entrenadoresBox.find(
            entrenador => entrenador.id === reserva?.profesionalId
        );
    }

    obtenerEntrenadorBoxDisponible(hora: string = this.horaReserva) {
        const disponibles = this.entrenadoresBox.filter(
            entrenador =>
                !this.entrenadorBoxOcupado(entrenador.id, hora)
        );

        if (!disponibles.length) {
            return undefined;
        }

        return disponibles[
            Math.floor(Math.random() * disponibles.length)
        ];
    }

    entrenadorBoxOcupado(
        entrenadorId: number,
        hora: string
    ): boolean {
        if (!this.fechaReserva || !hora) return false;

        const [horaNueva, minutoNuevo] = hora.split(':').map(Number);
        const inicioNuevo = horaNueva * 60 + minutoNuevo;
        const finNuevo = inicioNuevo + this.box.duracionSesion;

        return this.reservasTemporales.some(reserva => {
            if (
                reserva.tipoAtencion !== 'box' ||
                reserva.profesionalId !== entrenadorId ||
                reserva.fecha !== this.fechaReserva
            ) {
                return false;
            }

            if (
                reserva.modalidadBox === 'grupal' &&
                this.modalidadBox === 'grupal' &&
                reserva.hora === hora
            ) {
                return false;
            }

            const [horaExistente, minutoExistente] =
                reserva.hora.split(':').map(Number);

            const inicioExistente = horaExistente * 60 + minutoExistente;
            const finExistente = inicioExistente + reserva.duracion;

            return inicioNuevo < finExistente &&
                finNuevo > inicioExistente;
        });
    }

    entrenadorBoxSeleccionadoOcupado(): boolean {
        if (!this.entrenadorBoxSeleccionado || !this.horaReserva) {
            return false;
        }

        return this.entrenadorBoxOcupado(
            Number(this.entrenadorBoxSeleccionado),
            this.horaReserva
        );
    }

    limpiarConfirmacion() {
        this.mensajeConfirmacion = '';
    }
    limpiarFormulario() {
        this.entrenadorSeleccionado = '';
        this.nutricionistaSeleccionado = '';
        this.entrenadorBoxSeleccionado = '';
        this.modalidadBox = 'grupal';
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

    private mostrarAlerta(
        mensaje: string,
        tipo: 'success' | 'error'
    ): void {
        void Swal.fire({
            title: tipo === 'success' ? '¡Reserva creada exitosamente!' : 'No se pudo crear la reserva',
            text: mensaje,
            icon: tipo,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: tipo === 'success' ? '#3085d6' : '#d33'
        });
    }

    constructor() {
        this.cargarReservas();
    }

    private cargarReservas(): void {
        if (typeof localStorage === 'undefined') {
            return;
        }

        try {
            const reservasGuardadas = localStorage.getItem(this.claveReservas);

            if (reservasGuardadas) {
                this.reservasTemporales = JSON.parse(reservasGuardadas) as ReservaTemporal[];
            }
        } catch (error) {
            console.error('Error al cargar las reservas guardadas:', error);
            this.reservasTemporales = [];
        }
    }

    private guardarReservas(): void {
        if (typeof localStorage === 'undefined') {
            return;
        }

        try {
            localStorage.setItem(
                this.claveReservas,
                JSON.stringify(this.reservasTemporales)
            );
        } catch (error) {
            console.error('Error al guardar las reservas:', error);
        }
    }
}