import { TestBed } from '@angular/core/testing';
import { Planes } from './planes';

describe('Planes', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planes],
    }).compileComponents();
  });

  it('should show monthly prices by default', () => {
    const fixture = TestBed.createComponent(Planes);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.pricing-value')[0]?.textContent?.trim()).toBe('30');
    expect(compiled.querySelector('.pricing-billed')?.textContent?.trim()).toBe('Billed monthly');
    expect(compiled.querySelector('[aria-label="Billing frequency"] .active')?.textContent?.trim()).toBe(
      'Monthly',
    );
  });

  it('should show yearly prices and annual billing amounts when selected', () => {
    const fixture = TestBed.createComponent(Planes);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const yearlyButton = compiled.querySelector(
      '[aria-label="Billing frequency"] button:nth-child(2)',
    ) as HTMLButtonElement;

    yearlyButton.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.pricing-value')[0]?.textContent?.trim()).toBe('22');
    expect(compiled.querySelectorAll('.pricing-billed')[0]?.textContent?.trim()).toBe(
      '$264 billed annually',
    );
    expect(compiled.querySelector('.toggle-save')?.textContent?.trim()).toBe('Save 25%');
    expect(yearlyButton.getAttribute('aria-pressed')).toBe('true');
  });
});
