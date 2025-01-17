import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';
import { CommonModule } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        CalendarComponent,
        HeaderComponent,
        DialogComponent,
        ActivityReportFormComponent,
        LeaveFormComponent,
        CommonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should render the calendar component', () => {
    const calendarElement = fixture.debugElement.query(By.css('app-calendar'));
    expect(calendarElement).toBeTruthy();
  });

  it('should render the list of agents', () => {
    const agentElements = fixture.debugElement.queryAll(
      By.css('.container-list a')
    );
    expect(agentElements.length).toBeGreaterThan(0);
  });

  it('should render the list of activity reports', () => {
    const activityReportElements = fixture.debugElement.queryAll(
      By.css('.container-list p')
    );
    expect(activityReportElements.length).toBeGreaterThan(0);
  });

  it('should render the list of leaves', () => {
    const leaveElements = fixture.debugElement.queryAll(
      By.css('.container-list p')
    );
    expect(leaveElements.length).toBeGreaterThan(0);
  });

  it('should close the dialog when the close button is clicked', () => {
    component.viewActivity = component.activityReports()[0];
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(
      By.css('.container-edit img')
    );
    closeButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.viewActivity).toBeNull();
    expect(component.viewLeave).toBeNull();
  });
});
