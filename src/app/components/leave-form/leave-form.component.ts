import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Leave } from '../../interfaces/leave';
import { addLeave } from '../../store/agent.actions';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Agent } from '../../interfaces/agent';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss',
})
export class LeaveFormComponent {
  leave: FormGroup;
  storedAgents$: Observable<Agent[]>;
  storedLeaves$: Observable<Leave[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: { leaves: Leave[]; agents: Agent[] };
    }>
  ) {
    this.leave = this.fb.group({
      agentId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      reason: [null, Validators.required],
    });

    this.storedAgents$ = this.store.select((state) => state.app.agents);
    this.storedLeaves$ = this.store.select((state) => state.app.leaves);
  }

  onSubmit() {
    if (this.leave.valid) {
      this.store.dispatch(addLeave({ leaveData: this.leave.value }));
      this.leave.reset();
    }
  }
}
