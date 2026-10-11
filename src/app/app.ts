import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { GymCard } from './shared/components/gym-card/gym-card';
=======
import { share } from 'rxjs';
>>>>>>> 544901943d78c3f879cb1e29db188a13f4be3bc7

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
