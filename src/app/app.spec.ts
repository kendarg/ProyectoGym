import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the first hero slide', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Transforma tu cuerpo');
    expect(compiled.querySelectorAll('.hero-dot')).toHaveLength(4);
  });

  it('should advance to the next hero slide', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const nextButton = fixture.nativeElement.querySelector(
      '[aria-label="Diapositiva siguiente"]',
    ) as HTMLButtonElement;

    nextButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Cada repetición');
  });
});
