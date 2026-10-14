import { Component, OnDestroy, signal } from '@angular/core';

interface HeroSlide {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

@Component({
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio implements OnDestroy {
  protected readonly slides: HeroSlide[] = [
    {
      image: '/imgGym/009.jpg',
      alt: 'Zona de entrenamiento equipada de Ultra Fitness',
      eyebrow: 'Tu mejor versión empieza hoy',
      title: 'Transforma tu cuerpo. Fortalece tu vida.',
      description: 'Un paso a la vez, un entrenamiento a la vez. Tu cambio comienza aquí.',
      cta: 'Inscríbete hoy',
      href: '#Planes',
    },
    {
      image: '/imgGym/006.jpg',
      alt: 'Socios de Ultra Fitness entrenando con pesas',
      eyebrow: 'Entrena con propósito',
      title: 'Cada repetición te acerca a tu meta.',
      description: 'Encuentra tu fuerza, supera tus límites y celebra todo lo que eres capaz de lograr.',
      cta: 'Conoce nuestros planes',
      href: '#Planes',
    },
    {
      image: '/imgGym/004.jpg',
      alt: 'Socios entrenando en una clase grupal',
      eyebrow: 'La energía se comparte',
      title: 'Más movimiento. Más comunidad.',
      description: 'Entrena a tu ritmo, disfruta cada clase y alcanza tus objetivos acompañado.',
      cta: 'Explora las clases',
      href: '#Servicios',
    },
    {
      image: '/imgGym/003.jpg',
      alt: 'Socios corriendo en caminadoras',
      eyebrow: 'El momento es ahora',
      title: 'Empieza hoy. Sorpréndete mañana.',
      description: 'No necesitas tenerlo todo resuelto; solo dar el primer paso hacia una vida más activa.',
      cta: 'Empieza ahora',
      href: '#Planes',
    },
  ];
  protected readonly currentSlide = signal(0);
  private readonly autoplay = setInterval(() => this.nextSlide(), 6000);

  protected nextSlide(): void {
    this.currentSlide.update((current) => (current + 1) % this.slides.length);
  }

  protected previousSlide(): void {
    this.currentSlide.update((current) => (current - 1 + this.slides.length) % this.slides.length);
  }

  protected goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplay);
  }
}
