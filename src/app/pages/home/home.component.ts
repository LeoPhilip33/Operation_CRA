import { Component, computed } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Legend } from '../../interfaces/legend';
import { Agent } from '../../interfaces/agent';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';
import { AgentStatus } from '../../enum/agentStatus';
import {
  activityReportsSignal,
  agentsSignal,
  leavesSignal,
} from '../../store/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CalendarComponent,
    HeaderComponent,
    DialogComponent,
    ActivityReportFormComponent,
    LeaveFormComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  agents = computed(() => agentsSignal());
  leaves = computed(() => leavesSignal());
  activityReports = computed(() => activityReportsSignal());
  viewActivity: ActivityReport | null = null;
  viewLeave: Leave | null = null;

  legends: Legend[] = [
    {
      backgroundColor: '#FFC0CB',
      borderColor: '#5f0000',
      label: AgentStatus.AGENT_ABSENT,
    },
    {
      backgroundColor: '#d2d2ff',
      borderColor: '#0d0dba',
      label: AgentStatus.AGENT_PRESENT,
    },
  ];

  computeViewActivity(activityReport: ActivityReport) {
    this.viewActivity = activityReport;
  }

  computeViewLeave(leave: Leave) {
    this.viewLeave = leave;
  }

  getAgentById(agentId: number): Agent | undefined {
    return this.agents().find((agent) => agent.id === agentId);
  }
}
