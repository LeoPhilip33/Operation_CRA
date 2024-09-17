import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AgentFormComponent } from '../../components/agent-form/agent-form.component';
import { ActivityReportComponent } from '../../components/activity-report/activity-report.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, AgentFormComponent, ActivityReportComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
