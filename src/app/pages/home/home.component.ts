import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Legend } from '../../interfaces/legend';
import { Observable, tap } from 'rxjs';
import { Agent } from '../../interfaces/agent';
import { ActivityReport } from '../../interfaces/activity-report';
import { Store } from '@ngrx/store';

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
  agents: Agent[] = [];
  activityReports: ActivityReport[] = [];

  constructor(
    private store: Store<{
      app: { activityReports: ActivityReport[]; agents: Agent[] };
    }>
  ) {
    this.storedAgents$ = this.store.select((state) => state.app.agents);
    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );
  }

  legends: Legend[] = [
    {
      backgroundColor: '#f00',
      color: '#fff',
      label: 'Agent absent',
    },
    {
      backgroundColor: '#00f',
      color: '#fff',
      label: 'Activité réalisée',
    },
  ];

  ngOnInit(): void {
    this.storedActivityReport$
      .pipe(tap((activityReports) => (this.activityReports = activityReports)))
      .subscribe();

    this.storedAgents$
      .pipe(tap((agents) => (this.agents = agents)))
      .subscribe();
  }
}
