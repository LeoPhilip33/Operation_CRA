import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Legend } from '../../interfaces/legend';
import { Observable, tap } from 'rxjs';
import { Agent } from '../../interfaces/agent';
import { ActivityReport } from '../../interfaces/activity-report';
import { Store } from '@ngrx/store';
import { Leave } from '../../interfaces/leave';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CalendarComponent,
    HeaderComponent,
    DialogComponent,
    ActivityReportFormComponent,
    LeaveFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  storedAgents$: Observable<Agent[]>;
  storedActivityReport$: Observable<ActivityReport[]>;
  storedLeaves$: Observable<Leave[]>;
  agents: Agent[] = [];
  leaves: Leave[] = [];
  activityReports: ActivityReport[] = [];
  viewActivity: ActivityReport | null = null;
  viewLeave: Leave | null = null;

  constructor(
    private store: Store<{
      app: {
        activityReports: ActivityReport[];
        agents: Agent[];
        leaves: Leave[];
      };
    }>
  ) {
    this.storedAgents$ = this.store.select((state) => state.app.agents);
    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );
    this.storedLeaves$ = this.store.select((state) => state.app.leaves);
  }

  legends: Legend[] = [
    {
      backgroundColor: '#ffcfd2',
      borderColor: '#CC010F',
      label: 'Agent absent',
    },
    {
      backgroundColor: '#d2d2ff',
      borderColor: '#0d0dba',
      label: 'Agent présent',
    },
  ];

  computeViewActivity(activityReport: ActivityReport) {
    this.viewActivity = activityReport;
  }

  computeViewLeave(leave: Leave) {
    this.viewLeave = leave;
  }

  ngOnInit(): void {
    this.storedActivityReport$
      .pipe(tap((activityReports) => (this.activityReports = activityReports)))
      .subscribe();

    this.storedAgents$
      .pipe(tap((agents) => (this.agents = agents)))
      .subscribe();

    this.storedLeaves$
      .pipe(tap((leaves) => (this.leaves = leaves)))
      .subscribe();
  }
}
