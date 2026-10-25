
export const entrenadores = [
    {
        id: 1,
        nombre: 'Sofía Valentina Herrera Gómez',
        dias: ['lunes', 'miercoles', 'viernes'],
        horaInicio: '06:00',
        horaFin: '14:00',
        duracionSesion: 30
    },
    {
        id: 2,
        nombre: 'Mateo Alejandro Rojas Silva',
        dias: ['martes', 'jueves', 'sabado'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracionSesion: 30
    },
    {
        id: 3,
        nombre: 'Lucía Fernanda Morales Torres',
        dias: ['lunes', 'martes', 'jueves'],
        horaInicio: '07:30',
        horaFin: '15:30',
        duracionSesion: 30
    }
];
export const fisioterapeutas = [
    {
        id: 1,
        nombre: 'Valentina Isabel Castro Ruiz',
        dias: ['lunes', 'miercoles', 'viernes'],
        horaInicio: '06:00',
        horaFin: '14:00',
        duracionSesion: 45
    },
    {
        id: 2,
        nombre: 'Daniel Esteban Moreno Díaz',
        dias: ['martes', 'jueves', 'sabado'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracionSesion: 45
    },
    {
        id: 3,
        nombre: 'Camila Andrea Torres López',
        dias: ['lunes', 'martes', 'jueves'],
        horaInicio: '07:30',
        horaFin: '15:30',
        duracionSesion: 45
    }
];

export const nutricionistas = [
    {
        id: 1,
        nombre: 'Isabella María Rodríguez Pérez',
        dias: ['lunes', 'miercoles', 'viernes'],
        horaInicio: '06:00',
        horaFin: '14:00',
        duracionSesion: 15
    },
    {
        id: 2,
        nombre: 'Santiago Andrés Martínez López',
        dias: ['martes', 'jueves', 'sabado'],
        horaInicio: '09:00',
        horaFin: '17:00',
        duracionSesion: 15
    },
    {
        id: 3,
        nombre: 'Mariana Sofía González Torres',
        dias: ['lunes', 'martes', 'jueves'],
        horaInicio: '07:30',
        horaFin: '15:30',
        duracionSesion: 15
    }
];

export const sauna = {
    duracionTurno: 20,
    capacidadPorTurno: 5,
    dias: ['lunes', 'miercoles', 'viernes'],
    horarios: [{inicio: '07:00', fin: '10:00' }, { inicio: '17:00', fin: '20:00'}]
};

export const zumba = {
    duracionClase: 60,
    descansoInstructor: 15,
    capacidadPorClase: 20,
    dias: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    horarios: [{ inicio: '05:00', fin: '08:45' }, { inicio: '18:00', fin: '21:45' }]
};

export const entrenadoresBox = [
  {
    id: 1,
    nombre: 'Santiago Ramírez',
    especialidad: 'Boxeo técnico y acondicionamiento'
  },
  {
    id: 2,
    nombre: 'Valentina Cruz',
    especialidad: 'Técnica, defensa y velocidad'
  },
  {
    id: 3,
    nombre: 'Nicolás Torres',
    especialidad: 'Potencia, resistencia y preparación física'
  }
];

export const box = {
  duracionSesion: 60,
  capacidadGrupal: 10,
  diasGrupales: ['viernes', 'sabado', 'domingo'],
  horarioGrupal: {inicio: '16:00', fin: '21:00'},
  diasIndividuales: ['sabado'],
  horarioIndividual: {inicio: '10:00', fin: '14:00'}
};
