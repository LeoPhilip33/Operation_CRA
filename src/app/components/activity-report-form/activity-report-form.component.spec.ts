import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityReportFormComponent } from './activity-report-form.component';
import {
  addActivityReport,
  deleteActivityReport,
  updateActivityReport,
} from '../../store/app.actions';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { ActivityReport } from '../../interfaces/activity-report';
import { Agent } from '../../interfaces/agent';

describe('ActivityReportFormComponent', () => {
  let component: ActivityReportFormComponent;
  let fixture: ComponentFixture<ActivityReportFormComponent>;
  let store: MockStore;

  const initialState = {
    app: {
      activityReports: [] as ActivityReport[],
      agents: [] as Agent[],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule.forRoot([]), ToastComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ActivityReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.activityReport.value).toEqual({
      id: 0,
      agentId: null,
      project: '',
      startDate: null,
      endDate: null,
      activity: '',
    });
  });

  it('should populate the form if a selectedActivityReport is provided', () => {
    const mockActivityReport: ActivityReport = {
      id: 1,
      agentId: 1,
      project: 'Project A',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-02'),
      activity: 'Some activity description',
    };

    component.selectedActivityReport = mockActivityReport;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.activityReport.value).toEqual(mockActivityReport);
  });

  it('should validate the form', () => {
    component.activityReport.patchValue({
      agentId: 1,
      project: 'AAA',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-03'),
      activity: 'Some activity description',
    });
    fixture.detectChanges();

    expect(component.activityReport.valid).toBeTrue();
  });

  it('should emit update event when updating an existing activity report', () => {
    const mockActivityReport: ActivityReport = {
      id: 1,
      agentId: 1,
      project: 'Project A',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-02'),
      activity: 'Some activity description',
    };

    const spyDispatch = spyOn(store, 'dispatch').and.callThrough();
    const spyEmit = spyOn(component.isActivityReportUpdated, 'emit');

    component.selectedActivityReport = mockActivityReport;
    component.ngOnInit();
    component.onSubmit();

    expect(spyDispatch).toHaveBeenCalledWith(
      updateActivityReport({
        id: mockActivityReport.id,
        report: mockActivityReport,
      })
    );
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should dispatch addActivityReport when submitting a new report', () => {
    const spyDispatch = spyOn(store, 'dispatch').and.callThrough();

    component.activityReport.patchValue({
      id: 0,
      agentId: 1,
      project: 'Project A',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-02'),
      activity: 'Detailed activity description',
    });

    component.onSubmit();

    expect(spyDispatch).toHaveBeenCalledWith(
      addActivityReport({
        report: {
          id: 0,
          agentId: 1,
          project: 'Project A',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-02'),
          activity: 'Detailed activity description',
        },
      })
    );
  });

  it('should display error message if the form is invalid', () => {
    component.activityReport.patchValue({
      agentId: null,
      project: '',
      startDate: null,
      endDate: null,
      activity: '',
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Vérifier les champs du formulaire');
  });

  it('should dispatch deleteActivityReport when deleting an activity report', () => {
    const spyDispatch = spyOn(store, 'dispatch').and.callThrough();
    const spyEmit = spyOn(component.isActivityReportUpdated, 'emit');

    component.deleteActivityReport(1);

    expect(spyDispatch).toHaveBeenCalledWith(deleteActivityReport({ id: 1 }));
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should validate date range and set error if startDate is after endDate', () => {
    component.activityReport.patchValue({
      startDate: '2023-01-02',
      endDate: '2023-01-01',
    });
    component.dateRangeValidator(component.activityReport);
    fixture.detectChanges();

    const endDateControl = component.activityReport.get('endDate');
    expect(endDateControl?.errors).toEqual({ dateRange: true });
  });
});
