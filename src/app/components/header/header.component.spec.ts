import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'agents', component: HeaderComponent },
          { path: 'activity-report', component: HeaderComponent },
          { path: 'leave', component: HeaderComponent },
        ]),
        HeaderComponent,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="/"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/agents"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/activity-report"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/leave"]')).toBeTruthy();
  });

  it('should navigate to "agents" when clicking the Agents link', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const agentsLink = compiled.querySelector(
      'a[href="/agents"]'
    ) as HTMLElement;

    agentsLink.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(location.path()).toBe('/agents');
  });

  it('should navigate to "activity-report" when clicking the Activity Report link', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const activityReportLink = compiled.querySelector(
      'a[href="/activity-report"]'
    ) as HTMLElement;

    activityReportLink.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(location.path()).toBe('/activity-report');
  });

  it('should navigate to "leave" when clicking the Leave link', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const leaveLink = compiled.querySelector('a[href="/leave"]') as HTMLElement;

    leaveLink.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(location.path()).toBe('/leave');
  });

  it('should add "active" class when on the current route', async () => {
    const compiled = fixture.nativeElement as HTMLElement;

    router.navigate(['/agents']);
    fixture.detectChanges();
    await fixture.whenStable();

    const agentsLink = compiled.querySelector(
      'a[href="/agents"]'
    ) as HTMLElement;
    expect(agentsLink.classList).toContain('active');

    router.navigate(['/activity-report']);
    fixture.detectChanges();
    await fixture.whenStable();

    const activityReportLink = compiled.querySelector(
      'a[href="/activity-report"]'
    ) as HTMLElement;
    expect(activityReportLink.classList).toContain('active');
  });

  it('should not have "active" class on inactive routes', async () => {
    const compiled = fixture.nativeElement as HTMLElement;

    router.navigate(['/leave']);
    fixture.detectChanges();
    await fixture.whenStable();

    const homeLink = compiled.querySelector('a[href="/"]') as HTMLElement;
    const agentsLink = compiled.querySelector(
      'a[href="/agents"]'
    ) as HTMLElement;
    const activityReportLink = compiled.querySelector(
      'a[href="/activity-report"]'
    ) as HTMLElement;

    expect(homeLink.classList).not.toContain('active');
    expect(agentsLink.classList).not.toContain('active');
    expect(activityReportLink.classList).not.toContain('active');
  });
});
