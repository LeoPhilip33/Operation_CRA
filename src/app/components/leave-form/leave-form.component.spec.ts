import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LeaveFormComponent } from './leave-form.component';
import { By } from '@angular/platform-browser';

describe('LeaveFormComponent', () => {
  let component: LeaveFormComponent;
  let fixture: ComponentFixture<LeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LeaveFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveFormComponent);
    component = fixture.componentInstance;

    component.leave = new FormGroup({
      leaveType: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      type: new FormControl(''),
      agentId: new FormControl(''),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
