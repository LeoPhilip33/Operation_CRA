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

@Component({
  selector: 'app-activity-report',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './activity-report.component.html',
  styleUrl: './activity-report.component.scss',
})
export class ActivityReportComponent {
  activityReport: FormGroup;
  storedActivityReport$: Observable<ActivityReport[]>;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ app: { activityReports: ActivityReport[] } }>
  ) {
    this.errorMessage = null;

    this.activityReport = this.fb.group({
      agentId: [1, Validators.required],
      project: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      activity: ['', Validators.required],
    });

    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );

    this.storedActivityReport$.subscribe((data) => {
      console.log(data);
    });
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
