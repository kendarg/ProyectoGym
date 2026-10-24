import { TestBed } from '@angular/core/testing';
import { Inicio } from './inicio';

describe('Inicio', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
    }).compileComponents();
  });

  it('should render the first hero slide', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Transforma tu cuerpo');
    expect(compiled.querySelectorAll('.hero-dot')).toHaveLength(4);
  });

  it('should advance to the next hero slide', () => {
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    const nextButton = fixture.nativeElement.querySelector(
      '[aria-label="Diapositiva siguiente"]',
    ) as HTMLButtonElement;

    nextButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Cada repetición');
  });
});
