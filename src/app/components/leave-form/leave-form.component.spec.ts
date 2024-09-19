import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveFormComponent } from './leave-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { Agent } from '../../interfaces/agent';
import { Leave } from '../../interfaces/leave';
import { ActivityReport } from '../../interfaces/activity-report';
import { deleteLeave, addLeave } from '../../store/app.actions';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterModule } from '@angular/router';

describe('LeaveFormComponent', () => {
  let component: LeaveFormComponent;
  let fixture: ComponentFixture<LeaveFormComponent>;
  let store: MockStore;
  let initialState: any;
  const mockAgents: Agent[] = [
    { id: 1, lastName: 'Doe', firstName: 'John', leaveBalance: 10 },
  ];
  const mockLeaves: Leave[] = [];
  const mockActivityReports: ActivityReport[] = [];

  beforeEach(async () => {
    initialState = {
      app: {
        agents: mockAgents,
        leaves: mockLeaves,
        activityReports: mockActivityReports,
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        LeaveFormComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forRoot([]),
        ToastComponent,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.leave).toBeDefined();
    expect(component.leave.get('agentId')?.value).toBeNull();
    expect(component.leave.get('startDate')?.value).toBeNull();
    expect(component.leave.get('endDate')?.value).toBeNull();
    expect(component.leave.get('type')?.value).toBeNull();
  });

  it('should display a list of agents in the select dropdown', () => {
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(
      By.css('select[name="agents"]')
    );
    const options = selectElement?.nativeElement?.options;
    expect(options.length).toBe(2);
    expect(options[1].text).toContain('Doe John');
  });

  it('should display validation errors if form is submitted with invalid data', () => {
    component.leave.get('agentId')?.setValue(null);
    component.leave.get('startDate')?.setValue(null);
    component.leave.get('endDate')?.setValue(null);
    component.leave.get('type')?.setValue(null);

    Object.keys(component.leave.controls).forEach((key) => {
      const control = component.leave.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.isFieldInvalid('agentId')).toBeTrue();
    expect(component.isFieldInvalid('startDate')).toBeTrue();
    expect(component.isFieldInvalid('endDate')).toBeTrue();
    expect(component.isFieldInvalid('type')).toBeTrue();
  });

  it('should dispatch addLeave action when form is valid and submitted', () => {
    component.leave.patchValue({
      agentId: 1,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10'),
      type: 'paid-leave',
    });
    fixture.detectChanges();

    spyOn(store, 'dispatch');
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      addLeave({
        leaveData: {
          id: 0,
          agentId: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-10'),
          type: 'paid-leave',
        },
      })
    );
  });

  it('should display a toast message when form is submitted', () => {
    component.formSubmitted = true;
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('app-toast'));
    expect(toastElement).toBeTruthy();
  });

  it('should display error message if an overlapping leave is found', () => {
    spyOn(component, 'checkForExistingLeave').and.returnValue(true);
    component.leave.patchValue({
      agentId: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      type: 'paid-leave',
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Les dates sélectionnées se chevauchent avec une absence existante pour cet agent.'
    );
  });

  it('should handle deletion of leave correctly', () => {
    spyOn(store, 'dispatch');
    const leaveId = 1;
    component.deleteLeave(leaveId);

    expect(store.dispatch).toHaveBeenCalledWith(deleteLeave({ id: leaveId }));
  });
});
