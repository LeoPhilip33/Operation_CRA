import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Leave } from '../../interfaces/leave';
import {
  addLeave,
  deleteLeave,
  updateAgent,
  updateLeave,
} from '../../store/app.actions';
import { catchError, EMPTY, map, Observable, switchMap, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { ActivityReport } from '../../interfaces/activity-report';
import { GlobalService } from '../../services/global.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ToastComponent],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss',
})
export class LeaveFormComponent implements OnInit {
  @Input() selectedLeave: Leave | null = null;
  @Output() isLeaveUpdated = new EventEmitter<boolean>(false);

  leave: FormGroup;
  storedAgents$: Observable<Agent[]>;
  storedLeaves$: Observable<Leave[]>;
  storedActivityReport$: Observable<ActivityReport[]>;
  errorMessage: string | null = null;
  formSubmitted: boolean = false;
  previousLeaveData: Leave | null = null;

  constructor(
    private globalService: GlobalService,
    private fb: FormBuilder,
    private store: Store<{
      app: {
        activityReports: ActivityReport[];
        leaves: Leave[];
        agents: Agent[];
      };
    }>
  ) {
    this.leave = this.fb.group(
      {
        id: [0],
        agentId: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        type: [null, Validators.required],
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

  get agentId() {
    return this.leave.get('agentId');
  }

  get startDate() {
    return this.leave.get('startDate');
  }

  get endDate() {
    return this.leave.get('endDate');
  }

  get type() {
    return this.leave.get('type');
  }

  get remainingLeaves(): number {
    let leaveBalance = 0;
    this.storedAgents$
      .pipe(
        take(1),
        map((agents) => {
          const selectedAgent = agents.find(
            (a) => Number(a.id) === Number(this.leave.value.agentId)
          );
          if (selectedAgent) {
            leaveBalance = selectedAgent.leaveBalance;
          }
        })
      )
      .subscribe();
    return leaveBalance;
  }

  ngOnInit(): void {
    if (this.selectedLeave) {
      const userLeave = {
        ...this.selectedLeave,
        startDate: format(new Date(this.selectedLeave.endDate), 'yyyy-MM-dd'),
        endDate: format(new Date(this.selectedLeave.endDate), 'yyyy-MM-dd'),
      };

      this.leave.patchValue(userLeave);
      this.previousLeaveData = { ...this.selectedLeave };
    }

    this.leave.valueChanges
      .pipe(
        tap(() => {
          this.errorMessage = null;
        })
      )
      .subscribe();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.leave.get(field);
    return (control?.invalid && (control?.touched || control?.dirty)) ?? false;
  }

  deleteLeave(leaveId: number) {
    this.store.dispatch(deleteLeave({ id: leaveId }));
    this.isLeaveUpdated.emit(true);
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

  countWeekdays(startDate: Date, endDate: Date): number {
    let count = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  checkLeaveBalance(
    agentId: number,
    startDate: Date,
    endDate: Date,
    agents: Agent[]
  ): boolean {
    const agent = agents.find((a) => Number(a.id) === Number(agentId));
    if (!agent) {
      return false;
    }
    const totalLeaveDays = this.countWeekdays(startDate, endDate);

    return agent.leaveBalance >= totalLeaveDays;
  }

  isValidForm(): boolean {
    return this.leave.valid && !this.errorMessage;
  }

  onSubmit() {
    if (this.leave.valid) {
      this.errorMessage = null;
      const { startDate, endDate, agentId, type } = this.leave.value;

      this.checkForOverlappingActivity(startDate, endDate, agentId)
        .pipe(
          switchMap(() =>
            this.checkForExistingLeave(startDate, endDate, agentId)
          ),
          switchMap(() =>
            this.verifyAndUpdateAgentBalance(startDate, endDate, agentId, type)
          ),
          tap(() => this.handleLeaveSubmission(startDate, endDate, type)),
          catchError((err) => {
            this.errorMessage = err.message;
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      this.errorMessage = 'Vérifier les champs du formulaire';
    }
  }

  checkForOverlappingActivity(startDate: Date, endDate: Date, agentId: number) {
    return this.storedActivityReport$.pipe(
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
            "Les dates sélectionnées se chevauchent avec un rapport d'activité existant pour cet agent.";
          throw new Error(this.errorMessage);
        }
      })
    );
  }

  checkForExistingLeave(startDate: Date, endDate: Date, agentId: number) {
    return this.storedLeaves$.pipe(
      take(1),
      tap((leaves) => {
        if (
          this.globalService.checkForExistingLeave(
            startDate,
            endDate,
            agentId,
            leaves,
            this.selectedLeave ? this.selectedLeave.id : undefined
          )
        ) {
          this.errorMessage =
            'Les dates sélectionnées se chevauchent avec une absence existante pour cet agent.';
          throw new Error(this.errorMessage);
        }
      })
    );
  }

  verifyAndUpdateAgentBalance(
    startDate: Date,
    endDate: Date,
    agentId: number,
    type: string
  ) {
    return this.storedAgents$.pipe(
      take(1),
      tap((agents) => {
        const totalLeaveDays = this.countWeekdays(startDate, endDate);
        const agent = agents.find((a) => Number(a.id) === Number(agentId));

        if (!agent) {
          this.errorMessage = 'Agent introuvable.';
          throw new Error(this.errorMessage);
        }

        this.updateAgentLeaveBalance(agent, totalLeaveDays, type, agents);
      })
    );
  }

  updateAgentLeaveBalance(
    agent: any,
    totalLeaveDays: number,
    type: string,
    agents: any[]
  ) {
    const isSickLeave = type === 'sick';
    const previousLeaveDays = this.previousLeaveData
      ? this.countWeekdays(
          new Date(this.previousLeaveData.startDate),
          new Date(this.previousLeaveData.endDate)
        )
      : 0;

    let updatedAgents = [...agents];

    if (this.selectedLeave) {
      updatedAgents = this.updateBalanceForSelectedLeave(
        agent,
        previousLeaveDays,
        totalLeaveDays,
        isSickLeave,
        agents
      );
    } else {
      if (
        !isSickLeave &&
        !this.checkLeaveBalance(
          agent.id,
          new Date(this.leave.value.startDate),
          new Date(this.leave.value.endDate),
          agents
        )
      ) {
        this.errorMessage = `Le solde de congés de l'agent est insuffisant pour la période demandée. Congés restants : ${agent.leaveBalance} jours.`;
        throw new Error(this.errorMessage);
      }
      updatedAgents = agents.map((a) =>
        a.id === agent.id
          ? { ...a, leaveBalance: a.leaveBalance - totalLeaveDays }
          : a
      );
    }

    this.store.dispatch(
      updateAgent({ agentData: updatedAgents.find((a) => a.id === agent.id)! })
    );
  }

  updateBalanceForSelectedLeave(
    agent: any,
    previousLeaveDays: number,
    totalLeaveDays: number,
    isSickLeave: boolean,
    agents: any[]
  ) {
    if (this.previousLeaveData?.type !== this.leave.value.type) {
      if (this.previousLeaveData?.type !== 'sick' && isSickLeave) {
        return agents.map((a) =>
          a.id === agent.id
            ? { ...a, leaveBalance: a.leaveBalance + previousLeaveDays }
            : a
        );
      } else if (!isSickLeave && this.previousLeaveData?.type === 'sick') {
        return agents.map((a) =>
          a.id === agent.id
            ? { ...a, leaveBalance: a.leaveBalance - totalLeaveDays }
            : a
        );
      } else if (!isSickLeave && this.previousLeaveData?.type !== 'sick') {
        return agents.map((a) =>
          a.id === agent.id
            ? {
                ...a,
                leaveBalance:
                  a.leaveBalance + previousLeaveDays - totalLeaveDays,
              }
            : a
        );
      }
    } else {
      return agents.map((a) =>
        a.id === agent.id
          ? {
              ...a,
              leaveBalance: a.leaveBalance + previousLeaveDays - totalLeaveDays,
            }
          : a
      );
    }
    return agents;
  }

  handleLeaveSubmission(startDate: string, endDate: string, type: string) {
    if (this.selectedLeave) {
      this.store.dispatch(
        updateLeave({
          id: this.selectedLeave.id,
          leave: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            type,
          },
        })
      );
      this.isLeaveUpdated.emit(true);
    } else {
      this.store.dispatch(addLeave({ leaveData: this.leave.value }));
      this.formSubmitted = true;
    }

    this.leave.reset();
  }
}
