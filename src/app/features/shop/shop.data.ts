export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad?: number;
}

export const productos = [
    {id: 1, nombre: 'Proteína Whey (2 lbs)', precio: 150000, imagen: 'imgProductos/Proteina-whey.webp'},
    {id: 2, nombre: 'Creatina Monohidratada', precio: 80000, imagen: 'imgProductos/Creatina-monohidratada.webp'},
    {id: 3, nombre: 'Pre-entreno', precio: 110000, imagen:'imgProductos/Pre-entreno.webp'},
    {id: 4, nombre: 'Barra de Proteína', precio: 12000, imagen: 'imgProductos/Barra-de-proteina.webp'},
    {id: 5, nombre: 'Termo Mezclador', precio: 25000, imagen: 'imgProductos/Termo-mezclador.webp'},
    {id: 6, nombre: 'Straps', precio: 45000, imagen: 'imgProductos/Straps.webp'}
];