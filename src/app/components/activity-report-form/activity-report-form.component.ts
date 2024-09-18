import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, take, tap } from 'rxjs';
import { ActivityReport } from '../../interfaces/activity-report';
import { Store } from '@ngrx/store';
import {
  addActivityReport,
  updateActivityReport,
} from '../../store/agent.actions';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activity-report-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './activity-report-form.component.html',
  styleUrl: './activity-report-form.component.scss',
})
export class ActivityReportFormComponent implements OnInit {
  @Input() selectedActivityReport: ActivityReport | null = null;
  @Output() isActivityReportUpdated = new EventEmitter<boolean>(false);

  activityReport: FormGroup;
  storedAgents$: Observable<Agent[]>;
  errorMessage: string | null;
  storedActivityReport$: Observable<ActivityReport[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: { activityReports: ActivityReport[]; agents: Agent[] };
    }>
  ) {
    this.errorMessage = null;

    this.activityReport = this.fb.group(
      {
        id: [0],
        agentId: [null, Validators.required],
        project: ['', [Validators.required, Validators.minLength(3)]],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        activity: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: this
          .dateRangeValidator as AbstractControlOptions['validators'],
      } as AbstractControlOptions
    );

    this.storedAgents$ = this.store.select((state) => state.app.agents);
    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );
  }

  ngOnInit(): void {
    if (this.selectedActivityReport) {
      this.activityReport.patchValue(this.selectedActivityReport);
    }
  }

  get project() {
    return this.activityReport.get('project');
  }

  get startDate() {
    return this.activityReport.get('startDate');
  }

  get endDate() {
    return this.activityReport.get('endDate');
  }

  get activity() {
    return this.activityReport.get('activity');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.activityReport.get(field);
    return (control?.invalid && (control?.touched || control?.dirty)) ?? false;
  }

  dateRangeValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      formGroup.get('endDate')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    return null;
  }

  onSubmit() {
    if (this.activityReport.valid) {
      this.errorMessage = null;
      if (this.selectedActivityReport) {
        this.store.dispatch(
          updateActivityReport({
            id: this.selectedActivityReport.id,
            report: this.activityReport.value,
          })
        );

        this.isActivityReportUpdated.emit(true);
      } else {
        this.storedActivityReport$
          .pipe(
            take(1),
            tap((activityReport) => {
              this.activityReport.patchValue({
                id: activityReport ? activityReport.length : 0,
              });
            })
          )
          .subscribe();

        this.store.dispatch(
          addActivityReport({ report: this.activityReport.value })
        );
        this.activityReport.reset();
      }
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }
}
