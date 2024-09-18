import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { ActivityReportComponent } from './pages/activity-report/activity-report.component';
import { LeaveComponent } from './pages/leave/leave.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'activity-report', component: ActivityReportComponent },
  { path: 'leave', component: LeaveComponent },
];
