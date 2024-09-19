import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { select, Store } from '@ngrx/store';
import {
  addAgent,
  deleteActivityReport,
  deleteAgent,
  deleteLeave,
} from '../../store/app.actions';
import { CommonModule } from '@angular/common';
import { of, switchMap, take, tap } from 'rxjs';
import { Agent } from '../../interfaces/agent';
import { ToastComponent } from '../toast/toast.component';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.scss',
})
export class AgentFormComponent {
  agents: FormGroup;
  storedAgentsData$: Observable<Agent[]>;
  storedActivityReports$: Observable<ActivityReport[]>;
  storedLeaves$: Observable<Leave[]>;
  errorMessage: string | null;
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: {
        agents: Agent[];
        activityReports: ActivityReport[];
        leaves: Leave[];
      };
    }>
  ) {
    this.errorMessage = null;
    this.agents = this.fb.group({
      id: [0],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      leaveBalance: [5],
    });

    this.storedLeaves$ = this.store.select((state) => state.app.leaves);
    this.storedAgentsData$ = this.store.select((state) => state.app.agents);
    this.storedActivityReports$ = this.store.select(
      (state) => state.app.activityReports
    );
  }

  get lastName() {
    return this.agents.get('lastName');
  }

  get firstName() {
    return this.agents.get('firstName');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.agents.get(field);
    return (control?.invalid && (control?.touched || control?.dirty)) ?? false;
  }

  deleteAgent(id: number) {
    this.store
      .pipe(
        select((state) => state.app.activityReports),
        tap((activityReports) => {
          const activitiesToDelete = activityReports.filter(
            (report) => Number(report.agentId) === Number(id)
          );
          activitiesToDelete.forEach((activity) =>
            this.store.dispatch(deleteActivityReport({ id: activity.id }))
          );
        }),
        switchMap(() => this.store.pipe(select((state) => state.app.leaves))),
        tap((leaves) => {
          const leavesToDelete = leaves.filter(
            (leave) => Number(leave.agentId) === Number(id)
          );
          leavesToDelete.forEach((leave) =>
            this.store.dispatch(deleteLeave({ id: leave.id }))
          );
        }),
        switchMap(() => {
          this.store.dispatch(deleteAgent({ id }));
          return of(null);
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.storedAgentsData$
      .pipe(
        take(1),
        tap((agents) => {
          this.agents.patchValue({
            id: agents ? agents.length : 0,
          });

          if (this.agents.valid) {
            this.errorMessage = null;
            this.store.dispatch(addAgent({ agentData: this.agents.value }));
            this.agents.reset({
              leaveBalance: 5,
            });

            this.formSubmitted = true;
          } else {
            this.errorMessage = 'Form is invalid';
          }
        })
      )
      .subscribe();
  }
}
