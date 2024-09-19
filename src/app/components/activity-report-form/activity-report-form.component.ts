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
  deleteActivityReport,
  updateActivityReport,
} from '../../store/app.actions';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { Leave } from '../../interfaces/leave';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-activity-report-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ToastComponent],
  templateUrl: './activity-report-form.component.html',
  styleUrl: './activity-report-form.component.scss',
})
export class ActivityReportFormComponent implements OnInit {
  @Input() selectedActivityReport: ActivityReport | null = null;
  @Output() isActivityReportUpdated = new EventEmitter<boolean>(false);

  activityReport: FormGroup;
  storedAgents$: Observable<Agent[]>;
  storedLeaves$: Observable<Leave[]>;
  errorMessage: string | null = null;
  storedActivityReport$: Observable<ActivityReport[]>;
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private store: Store<{
      app: {
        activityReports: ActivityReport[];
        agents: Agent[];
        leaves: Leave[];
      };
    }>
  ) {
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
    this.storedLeaves$ = this.store.select((state) => state.app.leaves);
    this.storedActivityReport$ = this.store.select(
      (state) => state.app.activityReports
    );
  }

  ngOnInit(): void {
    if (this.selectedActivityReport) {
      this.activityReport.patchValue(this.selectedActivityReport);
    }

    this.activityReport.valueChanges
      .pipe(
        tap(() => {
          this.errorMessage = null;
        })
      )
      .subscribe();
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

  deleteActivityReport(activityReportId: number) {
    this.store.dispatch(deleteActivityReport({ id: activityReportId }));
    this.isActivityReportUpdated.emit(true);
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

  isValidForm(): boolean {
    return this.activityReport.valid && !this.errorMessage;
  }

  onSubmit() {
    if (this.activityReport.valid) {
      this.errorMessage = null;

      const startDate = new Date(this.activityReport.get('startDate')?.value);
      const endDate = new Date(this.activityReport.get('endDate')?.value);
      const agentId = this.activityReport.get('agentId')?.value;

      this.storedLeaves$
        .pipe(
          take(1),
          tap((leaves) => {
            if (
              this.globalService.checkForExistingLeave(
                startDate,
                endDate,
                agentId,
                leaves
              )
            ) {
              this.errorMessage =
                'Les dates chevauchent une période de congé existante.';
              return;
            }

            this.storedActivityReport$
              .pipe(
                take(1),
                tap((activityReports) => {
                  if (
                    this.globalService.checkForOverlappingActivities(
                      startDate,
                      endDate,
                      agentId,
                      activityReports
                    )
                  ) {
                    this.errorMessage =
                      'Les dates chevauchent une autre activité existante pour cet agent.';
                    return;
                  }

                  if (this.selectedActivityReport) {
                    this.store.dispatch(
                      updateActivityReport({
                        id: this.selectedActivityReport.id,
                        report: this.activityReport.value,
                      })
                    );

                    this.isActivityReportUpdated.emit(true);
                  } else {
                    this.activityReport.patchValue({
                      id: activityReports ? activityReports.length : 0,
                    });
                    this.store.dispatch(
                      addActivityReport({ report: this.activityReport.value })
                    );
                    this.activityReport.reset();
                  }

                  this.formSubmitted = true;
                })
              )
              .subscribe();
          })
        )
        .subscribe();
    } else {
      this.errorMessage = 'Vérifier les champs du formulaire';
    }
  }
}
