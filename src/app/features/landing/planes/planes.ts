import { Component, signal } from '@angular/core';

type BillingCycle = 'Mensual' | 'Anual';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  annualTotal: number;
  period: string;
  action: string;
  featured: boolean;
  features: string[];
}

@Component({
  selector: 'app-planes',
  styleUrl: './planes.css',
  templateUrl: './planes.html',
})

export class Planes {
  protected readonly billingCycle = signal<BillingCycle>('Mensual');
  protected readonly plans: PricingPlan[] = [
    {
      name: 'Plan basico',
      description: 'Acceso a zona de cardio y pesas',
      monthlyPrice: 69000,
      yearlyPrice: 59000,
      annualTotal: 708000,
      period: 'por mes',
      action: 'Inscribirme',
      featured: false,
      features: [
        'Acceso de lunes a viernes',
        'Sin clases grupales',
        'Sin acceso a duchas/Spa',
        'Cancelacion flexible con preaviso',
      ],
    },
    {
      name: 'Plan PRO',
      description: 'Acceso total e ilimitado',
      monthlyPrice: 80000,
      yearlyPrice: 75000,
      annualTotal: 900000,
      period: 'por mes',
      action: 'Comenzar',
      featured: true,
      features: [
        'Acceso 24/7 (todos los dias)',
        'Clases grupales ilimitadas',
        'Acceso a duchas y Spa',
        'Evaluacion fisica inicial',
        'Reserva de clases online',
      ],
    },
    {
      name: 'Plan Corporativo',
      description: 'Membresias para empresas y grupos',
      monthlyPrice: 75000,
      yearlyPrice: 70000,
      annualTotal: 840000,
      period: 'por mes /minimo 7 miembros',
      action: 'Comenzar en grupo',
      featured: false,
      features: [
        'Todo lo del plan PRO (para cada miembro)',
        'Facturacion consolidada',
        'Descuentos grupales progresivos',
        'Reporte de uso y asistencia de miembros',
      ],
    },
  ];

  protected setBillingCycle(cycle: BillingCycle): void {
    this.billingCycle.set(cycle);
  }
}
