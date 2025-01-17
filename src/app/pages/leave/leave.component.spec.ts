import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LeaveComponent } from './leave.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LeaveComponent', () => {
  let component: LeaveComponent;
  let fixture: ComponentFixture<LeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        LeaveFormComponent,
        ActivityReportFormComponent,
        LeaveComponent,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should render the leave form component', () => {
    const leaveFormElement = fixture.debugElement.query(
      By.css('app-leave-form')
    );
    expect(leaveFormElement).toBeTruthy();
  });

  it('should have a container with class "container-leave"', () => {
    const containerElement = fixture.debugElement.query(
      By.css('.container-leave')
    );
    expect(containerElement).toBeTruthy();
  });
});
