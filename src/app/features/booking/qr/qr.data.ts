export interface Maquina {
    id: number;
    nombre: string;
    url: string;
    qr?: string;
}

export const maquinas: Maquina[] = [
    { 
        id: 1, 
        nombre: 'Cómo usar la máquina de remo (Row Erg)', 
        url: 'http://www.youtube.com/watch?v=A-35F9TR0OA' 
    },
    { 
        id: 2, 
        nombre: 'Diferencias y técnica en la máquina de abductores de cadera', 
        url: 'http://www.youtube.com/watch?v=tu4o4quPv2k' 
    },
    { 
        id: 3, 
        nombre: 'Cómo evitar errores comunes en la máquina de aperturas de pecho (Chest Fly)', 
        url: 'http://www.youtube.com/watch?v=IZS2RMmqt3E' 
    },
    { 
        id: 4, 
        nombre: 'Dominando la técnica correcta en el jalón de dorsal (Lat Pulldown)', 
        url: 'http://www.youtube.com/watch?v=dhJ7QJPvqqU' 
    },
    { 
        id: 5, 
        nombre: 'Configuración rápida para extensiones de tríceps con cuerda en polea', 
        url: 'http://www.youtube.com/watch?v=6Dh8sD6aNQE' 
    },
    { 
        id: 6, 
        nombre: 'Rutina corta en máquinas de espalda', 
        url: 'http://www.youtube.com/watch?v=wpt2_sVRALE' 
    },
];