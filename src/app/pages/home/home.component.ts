import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Legend } from '../../interfaces/legend';
import { Observable, tap } from 'rxjs';
import { Agent } from '../../interfaces/agent';
import { ActivityReport } from '../../interfaces/activity-report';
import { Store } from '@ngrx/store';
import { Leave } from '../../interfaces/leave';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, HeaderComponent],
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
      backgroundColor: '#CC010F',
      color: '#fff',
      label: 'Agent absent',
    },
    {
      backgroundColor: '#0d0dba',
      color: '#fff',
      label: 'Agent présent',
    },
  ];

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
