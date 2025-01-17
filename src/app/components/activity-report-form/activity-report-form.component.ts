import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';
import { ActivityReport } from '../../interfaces/activity-report';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { Leave } from '../../interfaces/leave';
import { GlobalService } from '../../services/global.service';
import {
  activityReportsSignal,
  agentsSignal,
  leavesSignal,
} from '../../store/signals';
import {
  addActivityReport,
  deleteActivityReport,
  updateActivityReport,
} from '../../store/signal-operations';
import { formatDateToISO } from '../../utils/date.util';

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
  storedLeaves: Leave[] = leavesSignal();
  storedActivityReport: ActivityReport[] = activityReportsSignal();
  errorMessage: string | null = null;
  formSubmitted: boolean = false;
  agents = agentsSignal();

  constructor(private fb: FormBuilder, private globalService: GlobalService) {
    this.activityReport = this.fb.group(
      {
        id: [0],
        agentId: [null, Validators.required],
        project: ['', [Validators.required, Validators.minLength(3)]],
        startDate: [formatDateToISO(new Date()), Validators.required],
        endDate: [null, Validators.required],
        activity: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: this
          .dateRangeValidator as AbstractControlOptions['validators'],
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {
    if (this.selectedActivityReport) {
      const reportWithDates = {
        ...this.selectedActivityReport,
        startDate: formatDateToISO(
          new Date(this.selectedActivityReport.startDate)
        ),
        endDate: formatDateToISO(new Date(this.selectedActivityReport.endDate)),
      };

      this.activityReport.patchValue(reportWithDates);
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
    deleteActivityReport(activityReportId);
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
      const currentActivityReportId = this.selectedActivityReport?.id;

      this.validateActivityReport(
        startDate,
        endDate,
        agentId,
        currentActivityReportId
      );
    } else {
      this.errorMessage = 'Vérifier les champs du formulaire';
    }
  }

  validateActivityReport(
    startDate: Date,
    endDate: Date,
    agentId: number,
    currentActivityReportId?: number
  ) {
    this.checkForLeaveConflicts(
      startDate,
      endDate,
      agentId,
      this.storedLeaves,
      currentActivityReportId
    );

    this.checkForActivityConflicts(
      startDate,
      endDate,
      agentId,
      this.storedActivityReport,
      currentActivityReportId
    );
    this.handleActivityReportSubmission(this.storedActivityReport);
  }

  checkForLeaveConflicts(
    startDate: Date,
    endDate: Date,
    agentId: number,
    leaves: Leave[],
    currentActivityReportId?: number
  ) {
    if (
      this.globalService.checkForExistingLeave(
        startDate,
        endDate,
        agentId,
        leaves,
        currentActivityReportId
      )
    ) {
      this.errorMessage =
        'Les dates chevauchent une période de congé existante.';
    }
  }

  checkForActivityConflicts(
    startDate: Date,
    endDate: Date,
    agentId: number,
    activityReports: ActivityReport[],
    currentActivityReportId?: number
  ) {
    if (
      this.globalService.checkForOverlappingActivities(
        startDate,
        endDate,
        agentId,
        activityReports,
        currentActivityReportId
      )
    ) {
      this.errorMessage =
        'Les dates chevauchent une autre activité existante pour cet agent.';
    }
  }

  handleActivityReportSubmission(activityReports: ActivityReport[]) {
    if (this.selectedActivityReport) {
      updateActivityReport(this.activityReport.value);
      this.isActivityReportUpdated.emit(true);
    } else {
      this.activityReport.patchValue({
        id: activityReports ? activityReports.length : 0,
      });

      addActivityReport(this.activityReport.value);
      this.activityReport.reset();
    }

    this.formSubmitted = true;
  }
}
