import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GymCard } from './shared/components/gym-card/gym-card';

@Component({
  imports: [RouterOutlet,GymCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gym-app');
  servicios = [
  { titulo: 'Musculación', descripcion: 'Entrenamiento con pesas' },
  { titulo: 'Cardio', descripcion: 'Mejora tu resistencia' },
  { titulo: 'Yoga', descripcion: 'Flexibilidad y relajación' }
];
}
