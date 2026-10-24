import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sedes } from './features/landing/sedes/sedes';
import { Planes } from './features/landing/planes/planes';
import { Inicio } from './features/landing/inicio/inicio';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  imports: [Planes, Inicio, Navbar, RouterOutlet, Sedes, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('gym-app');
}
