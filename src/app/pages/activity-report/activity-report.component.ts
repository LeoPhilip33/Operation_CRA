import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivityReportFormComponent } from '../../components/activity-report-form/activity-report-form.component';

@Component({
  selector: 'app-activity-report',
  standalone: true,
  imports: [HeaderComponent, ActivityReportFormComponent],
  templateUrl: './activity-report.component.html',
  styleUrl: './activity-report.component.scss',
})
export class ActivityReportComponent {}
