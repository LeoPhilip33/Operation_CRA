import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AgentFormComponent } from '../../components/agent-form/agent-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CalendarComponent, AgentFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
