import { Component, OnInit } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { productos, type Producto } from "./shop.data";

@Component({
    selector: 'app-shop',
    imports: [CurrencyPipe],
    templateUrl: './shop.html',
    styleUrl: './shop.css',
})
export class Shop implements OnInit {
    productos = productos;
    carrito: Producto[] = [];
    carritoAbierto = false;
    private readonly claveCarrito = 'gym-carrito';

    agregarAlCarrito(producto: Producto) {
        const existente = this.carrito.find(
            item => item.id === producto.id
        );

        if (existente) {
            existente.cantidad = (existente.cantidad ?? 0) + 1;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        this.guardarCarrito()
    }

    abrirCarrito() {
        this.carritoAbierto = true;
    }

    calcularTotal() {
        return this.carrito.reduce((acumulado, producto) => {
            return acumulado + producto.precio * (producto.cantidad ?? 1);
        }, 0);
    }

    disminuirCantidad(id: number) {
        const existente = this.carrito.find(
            item => item.id === id
        );

        if (existente) {
            if ((existente.cantidad ?? 1) > 1) {
                existente.cantidad = (existente.cantidad ?? 1) - 1;
            } else {
                this.carrito = this.carrito.filter(item => item.id !== id);
            }
        }
        this.guardarCarrito()
    }

    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito()
    }

    contarUnidades() {
        return this.carrito.reduce((total, producto) => total + (producto.cantidad ?? 1), 0);
    }

    private guardarCarrito() {
        localStorage.setItem(this.claveCarrito, JSON.stringify(this.carrito));
    }

    ngOnInit() {
        const guardado = localStorage.getItem(this.claveCarrito);

        if (guardado !== null) {
            this.carrito = JSON.parse(guardado);
        }
    }
}