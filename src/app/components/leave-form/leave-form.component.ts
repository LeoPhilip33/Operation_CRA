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
      this.leave.patchValue(this.selectedLeave);
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

  checkForOverlappingActivities(
    startDate: Date,
    endDate: Date,
    agentId: number,
    activityReports: ActivityReport[]
  ): boolean {
    return activityReports
      .filter((activity) => activity.agentId === agentId)
      .some((activity) => {
        const activityStart = new Date(activity.startDate);
        const activityEnd = new Date(activity.endDate);
        return startDate <= activityEnd && endDate >= activityStart;
      });
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

  checkForExistingLeave(
    startDate: Date,
    endDate: Date,
    agentId: number,
    leaves: Leave[],
    currentLeaveId?: number
  ): boolean {
    return leaves
      .filter(
        (leave) =>
          Number(leave.agentId) === Number(agentId) &&
          Number(leave.id) !== Number(currentLeaveId)
      )
      .some((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return startDate <= leaveEnd && endDate >= leaveStart;
      });
  }

  onSubmit() {
    if (this.leave.valid) {
      this.errorMessage = null;
      const { startDate, endDate, agentId, type } = this.leave.value;
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      this.storedActivityReport$
        .pipe(
          take(1),
          tap((activityReports) => {
            if (
              this.checkForOverlappingActivities(
                startDateObj,
                endDateObj,
                agentId,
                activityReports
              )
            ) {
              this.errorMessage =
                "Les dates sélectionnées se chevauchent avec un rapport d'activité existant pour cet agent.";
              throw new Error(this.errorMessage);
            }
          }),
          switchMap(() => this.storedLeaves$.pipe(take(1))),
          tap((leaves) => {
            if (
              this.checkForExistingLeave(
                startDateObj,
                endDateObj,
                agentId,
                leaves,
                this.selectedLeave ? this.selectedLeave.id : undefined
              )
            ) {
              this.errorMessage =
                'Les dates sélectionnées se chevauchent avec une absence existante pour cet agent.';
              throw new Error(this.errorMessage);
            }
          }),
          switchMap(() => this.storedAgents$.pipe(take(1))),
          tap((agents) => {
            const totalLeaveDays = this.countWeekdays(startDateObj, endDateObj);
            const agent = agents.find((a) => Number(a.id) === Number(agentId));

            if (!agent) {
              this.errorMessage = 'Agent introuvable.';
              throw new Error(this.errorMessage);
            }

            const isSickLeave = type === 'sick';
            const previousLeaveDays = this.previousLeaveData
              ? this.countWeekdays(
                  new Date(this.previousLeaveData.startDate),
                  new Date(this.previousLeaveData.endDate)
                )
              : 0;

            let updatedAgents = [...agents];
            if (this.selectedLeave) {
              if (this.previousLeaveData) {
                if (this.previousLeaveData.type !== type) {
                  if (this.previousLeaveData.type !== 'sick' && isSickLeave) {
                    updatedAgents = agents.map((a) => {
                      if (Number(a.id) === Number(agentId)) {
                        return {
                          ...a,
                          leaveBalance: a.leaveBalance + previousLeaveDays,
                        };
                      }
                      return a;
                    });
                  } else if (
                    !isSickLeave &&
                    this.previousLeaveData.type === 'sick'
                  ) {
                    updatedAgents = agents.map((a) => {
                      if (Number(a.id) === Number(agentId)) {
                        return {
                          ...a,
                          leaveBalance: a.leaveBalance - totalLeaveDays,
                        };
                      }
                      return a;
                    });
                  } else if (
                    !isSickLeave &&
                    this.previousLeaveData.type !== 'sick'
                  ) {
                    updatedAgents = agents.map((a) => {
                      if (Number(a.id) === Number(agentId)) {
                        return {
                          ...a,
                          leaveBalance:
                            a.leaveBalance + previousLeaveDays - totalLeaveDays,
                        };
                      }
                      return a;
                    });
                  }
                } else {
                  updatedAgents = agents.map((a) => {
                    if (Number(a.id) === Number(agentId)) {
                      return {
                        ...a,
                        leaveBalance:
                          a.leaveBalance + previousLeaveDays - totalLeaveDays,
                      };
                    }
                    return a;
                  });
                }
              }
            } else {
              if (
                !isSickLeave &&
                !this.checkLeaveBalance(
                  agentId,
                  startDateObj,
                  endDateObj,
                  agents
                )
              ) {
                this.errorMessage = `Le solde de congés de l'agent est insuffisant pour la période demandée. Congés restants : ${agent.leaveBalance} jours.`;
                throw new Error(this.errorMessage);
              }
              updatedAgents = agents.map((a) => {
                if (Number(a.id) === Number(agentId)) {
                  return {
                    ...a,
                    leaveBalance: a.leaveBalance - totalLeaveDays,
                  };
                }
                return a;
              });
            }

            this.store.dispatch(
              updateAgent({
                agentData: updatedAgents.find(
                  (a) => Number(a.id) === Number(agentId)
                )!,
              })
            );

            if (this.selectedLeave) {
              this.store.dispatch(
                updateLeave({
                  id: this.selectedLeave.id,
                  leave: {
                    startDate: this.leave.value.startDate,
                    endDate: this.leave.value.endDate,
                    type: this.leave.value.type,
                  },
                })
              );
              this.isLeaveUpdated.emit(true);
            } else {
              this.store.dispatch(
                addLeave({
                  leaveData: this.leave.value,
                })
              );
            }

            this.leave.reset();
            this.formSubmitted = true;
          }),
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
}
