import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { Legend } from '../../interfaces/legend';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from 'date-fns';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load days for the current month', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const start = startOfMonth(component.currentMonth);
    const end = endOfMonth(component.currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const startWeek = start.getDay();
    const daysBeforeMonth = Array(startWeek).fill(null);
    const allDays = [...daysBeforeMonth, ...daysInMonth];

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    expect(component.weeks).toEqual(weeks);
  });

  it('should navigate to previous month', () => {
    const initialMonth = component.currentMonth;
    component.prevMonth();
    fixture.detectChanges();

    const newMonth = component.currentMonth;
    expect(newMonth).toEqual(subMonths(initialMonth, 1));
  });

  it('should navigate to next month', () => {
    const initialMonth = component.currentMonth;
    component.nextMonth();
    fixture.detectChanges();

    const newMonth = component.currentMonth;
    expect(newMonth).toEqual(addMonths(initialMonth, 1));
  });

  it('should format the month correctly', () => {
    const date = new Date();
    const formattedDate = format(date, 'MMMM yyyy');
    expect(component.format(date)).toEqual(formattedDate);
  });

  it('should return the correct background color for a legend', () => {
    const legends: Legend[] = [
      { label: 'Vacation', backgroundColor: 'red', borderColor: 'darkred' },
    ];
    component.legends = legends;

    expect(component.getBackGroundColor('Vacation')).toEqual('red');
    expect(component.getBackGroundColor('Nonexistent')).toEqual('');
  });

  it('should return the correct border color for a legend', () => {
    const legends: Legend[] = [
      { label: 'Meeting', backgroundColor: 'blue', borderColor: 'darkblue' },
    ];
    component.legends = legends;

    expect(component.getBorderColor('Meeting')).toEqual('darkblue');
    expect(component.getBorderColor('Nonexistent')).toEqual('');
  });

  it('should emit viewActivity event when viewCra is called', fakeAsync(() => {
    spyOn(component.viewActivity, 'emit');
    const activity: ActivityReport = {
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      activity: 'Activity 1',
      project: '',
      agentId: 0,
    };

    component.viewCra(activity);
    tick();

    expect(component.viewActivity.emit).toHaveBeenCalledWith(activity);
  }));

  it('should emit viewLeave event when viewAgentLeave is called', fakeAsync(() => {
    spyOn(component.viewLeave, 'emit');
    const leave: Leave = {
      id: 1,
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Vacation',
      agentId: 0,
    };

    component.viewAgentLeave(leave);
    tick();

    expect(component.viewLeave.emit).toHaveBeenCalledWith(leave);
  }));
});
