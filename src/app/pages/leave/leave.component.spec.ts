import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveComponent } from './leave.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

describe('LeaveComponent', () => {
  let component: LeaveComponent;
  let fixture: ComponentFixture<LeaveComponent>;
  let store: MockStore;
  const initialState = { app: { activityReports: [], leaves: [], agents: [] } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LeaveComponent,
        HeaderComponent,
        LeaveFormComponent,
        RouterModule.forRoot([]),
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render HeaderComponent', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should render LeaveFormComponent', () => {
    const leaveFormElement = fixture.debugElement.query(
      By.css('app-leave-form')
    );
    expect(leaveFormElement).toBeTruthy();
  });

  it('should have the correct CSS class applied', () => {
    const containerElement = fixture.debugElement.query(
      By.css('.container-leave')
    );
    expect(containerElement).toBeTruthy();
  });
});
