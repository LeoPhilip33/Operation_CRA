import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Leave } from '../../interfaces/leave';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { GlobalService } from '../../services/global.service';
import {
  activityReportsSignal,
  agentsSignal,
  leavesSignal,
} from '../../store/signals';
import {
  addLeave,
  deleteLeave,
  updateAgent,
  updateLeave,
} from '../../store/signal-operations';
import { formatDateToISO } from '../../utils/date.util';

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
  errorMessage: string | null = null;
  formSubmitted: boolean = false;
  previousLeaveData: Leave | null = null;
  agents = agentsSignal();

  constructor(private globalService: GlobalService, private fb: FormBuilder) {
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

    const selectedAgent = agentsSignal().find(
      (a) => Number(a.id) === Number(this.leave.value.agentId)
    );

    if (selectedAgent) {
      leaveBalance = selectedAgent.leaveBalance;
    }

    return leaveBalance;
  }

  ngOnInit(): void {
    if (this.selectedLeave) {
      const leaveWithDates = {
        ...this.selectedLeave,
        startDate: formatDateToISO(new Date(this.selectedLeave.startDate)),
        endDate: formatDateToISO(new Date(this.selectedLeave.endDate)),
      };

      this.leave.patchValue(leaveWithDates);
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
    deleteLeave(leaveId);
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
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (
        this.globalService.checkForOverlappingActivities(
          startDateObj,
          endDateObj,
          agentId,
          activityReportsSignal()
        )
      ) {
        this.errorMessage =
          "Les dates sélectionnées se chevauchent avec un rapport d'activité existant pour cet agent.";
      }

      if (
        this.globalService.checkForExistingLeave(
          startDateObj,
          endDateObj,
          agentId,
          leavesSignal(),
          this.selectedLeave ? this.selectedLeave.id : undefined
        )
      ) {
        this.errorMessage =
          'Les dates sélectionnées se chevauchent avec une absence existante pour cet agent.';
      }

      const agents = agentsSignal();

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
            } else if (!isSickLeave && this.previousLeaveData.type === 'sick') {
              updatedAgents = agents.map((a) => {
                if (Number(a.id) === Number(agentId)) {
                  return {
                    ...a,
                    leaveBalance: a.leaveBalance - totalLeaveDays,
                  };
                }
                return a;
              });
            } else if (!isSickLeave && this.previousLeaveData.type !== 'sick') {
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
          !this.checkLeaveBalance(agentId, startDateObj, endDateObj, agents)
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
      updateAgent(updatedAgents.find((a) => Number(a.id) === Number(agentId))!);

      if (this.selectedLeave) {
        const updatedLeave = {
          ...this.selectedLeave,
          startDate,
          endDate,
          type,
        };

        updateLeave(updatedLeave);

        this.isLeaveUpdated.emit(true);
      } else {
        addLeave(this.leave.value);
      }

      this.leave.reset();
      this.formSubmitted = true;
    } else {
      this.errorMessage = 'Vérifier les champs du formulaire';
    }
  }
}
