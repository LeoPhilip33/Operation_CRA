import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivityReport } from '../../interfaces/activity-report';
import { Store } from '@ngrx/store';
import { addActivityReport } from '../../store/agent.actions';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activity-report-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './activity-report-form.component.html',
  styleUrl: './activity-report-form.component.scss',
})
export class ActivityReportFormComponent {
  activityReport: FormGroup;
  storedActivityReport$: Observable<ActivityReport[]>;
  storedAgents$: Observable<Agent[]>;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: { activityReports: ActivityReport[]; agents: Agent[] };
    }>
  ) {
    this.errorMessage = null;

    this.activityReport = this.fb.group({
      agentId: [null, Validators.required],
      project: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      activity: [null, Validators.required],
    });

    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );

    this.storedAgents$ = this.store.select((state) => state.app.agents);
  }

  isFieldInvalid(field: string): boolean {
    return (
      (this.activityReport.get(field)?.invalid &&
        this.activityReport.get(field)?.touched) ??
      false
    );
  }

  onSubmit() {
    if (this.activityReport.valid) {
      this.errorMessage = null;
      this.store.dispatch(
        addActivityReport({ report: this.activityReport.value })
      );
      this.activityReport.reset();
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }
}
