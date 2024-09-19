import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';
import { RouterModule } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;
  const initialState = {
    app: {
      activityReports: [],
      agents: [],
      leaves: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CalendarComponent,
        HeaderComponent,
        DialogComponent,
        RouterModule.forRoot([]),
        ActivityReportFormComponent,
        LeaveFormComponent,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call computeViewActivity on event emission', () => {
    spyOn(component, 'computeViewActivity');

    const activityReport: ActivityReport = {
      id: 1,
      project: 'Project A',
      startDate: new Date('2024-09-19T14:19:29Z'),
      endDate: new Date('2024-09-19T14:19:29Z'),
      activity: 'Meeting',
      agentId: 1,
    };

    component.computeViewActivity(activityReport);

    fixture.detectChanges();

    expect(component.computeViewActivity).toHaveBeenCalledWith(activityReport);
  });

  it('should call computeViewLeave on event emission', () => {
    spyOn(component, 'computeViewLeave');

    const leave: Leave = {
      id: 1,
      agentId: 1,
      startDate: new Date('2024-09-19T14:19:29Z'),
      endDate: new Date('2024-09-19T14:19:29Z'),
      type: 'Vacation',
    };

    component.computeViewLeave(leave);

    fixture.detectChanges();

    expect(component.computeViewLeave).toHaveBeenCalledWith(leave);
  });

  it('should display the dialog when viewActivity or viewLeave is set', () => {
    component.viewActivity = {
      id: 1,
      project: 'Project A',
      startDate: new Date('2024-09-19T14:19:29Z'),
      endDate: new Date('2024-09-19T14:19:29Z'),
      activity: 'Meeting',
      agentId: 1,
    };
    fixture.detectChanges();

    const overlay =
      fixture.debugElement.nativeElement.querySelector('.overlay');
    expect(overlay).toBeTruthy();
  });

  it('should hide the dialog when viewActivity and viewLeave are null', () => {
    component.viewActivity = null;
    component.viewLeave = null;
    fixture.detectChanges();

    const overlay =
      fixture.debugElement.nativeElement.querySelector('.overlay');
    expect(overlay).toBeFalsy();
  });

  it('should handle close button click', () => {
    component.viewActivity = {
      id: 1,
      project: 'Project A',
      startDate: new Date('2024-09-19T14:19:29Z'),
      endDate: new Date('2024-09-19T14:19:29Z'),
      activity: 'Meeting',
      agentId: 1,
    };
    fixture.detectChanges();

    const closeButton = fixture.debugElement.nativeElement.querySelector(
      'img[src="assets/cross.svg"]'
    );
    closeButton.click();
    fixture.detectChanges();

    expect(component.viewActivity).toBeNull();
    expect(component.viewLeave).toBeNull();
  });
});
