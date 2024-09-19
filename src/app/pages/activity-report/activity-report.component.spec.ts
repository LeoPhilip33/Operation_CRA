import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityReportComponent } from './activity-report.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ActivityReportComponent', () => {
  let component: ActivityReportComponent;
  let fixture: ComponentFixture<ActivityReportComponent>;
  let store: MockStore;

  const initialState = {};

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: () => '1',
      },
    },
    params: of({ id: '1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityReportComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-header component', () => {
    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeTruthy();
  });

  it('should render app-activity-report-form component', () => {
    const form = fixture.debugElement.query(By.css('app-activity-report-form'));
    expect(form).toBeTruthy();
  });

  it('should apply the container-activity-report class', () => {
    const container = fixture.debugElement.query(
      By.css('.container-activity-report')
    );
    expect(container).toBeTruthy();
  });
});
