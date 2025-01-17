import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';

describe('ActivityReportFormComponent', () => {
  let component: ActivityReportFormComponent;
  let fixture: ComponentFixture<ActivityReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ActivityReportFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Reporter une activité" when no activity report is selected', () => {
    component.selectedActivityReport = null;
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(title.textContent).toContain('Reporter une activité');
  });

  it('should display "Modifier une activité" when an activity report is selected', () => {
    component.selectedActivityReport = {
      id: 1,
      agentId: 1,
      project: 'Test Project',
      startDate: new Date(),
      endDate: new Date(),
      activity: 'Test Activity',
    };
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(title.textContent).toContain('Modifier une activité');
  });

  it('should display error message when agentId is invalid', () => {
    component.activityReport.controls['agentId'].setValue(null);
    component.activityReport.controls['agentId'].markAsTouched();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.error')
    ).nativeElement;
    expect(errorMessage.textContent).toContain('Agent est requis.');
  });

  it('should display error message when project is invalid', () => {
    component.activityReport.controls['project'].setValue('');
    component.activityReport.controls['project'].markAsTouched();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.error')
    ).nativeElement;
    expect(errorMessage.textContent).toContain(
      'Projet est requis et doit comporter au moins 3 caractères.'
    );
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
