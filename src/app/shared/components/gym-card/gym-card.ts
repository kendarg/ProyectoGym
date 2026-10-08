import { Component, input } from "@angular/core";

@Component({
    selector:'app-gym-card',
    templateUrl:'./gym-card.html',
    styleUrl:'./gym-card.css',
})
export class GymCard{
    titulo = input('');
    descripcion = input('Conoce nuestros servicios');
}