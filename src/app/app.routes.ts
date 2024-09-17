import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { ActivityReportComponent } from './pages/activity-report/activity-report.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'activity-report', component: ActivityReportComponent },
];
