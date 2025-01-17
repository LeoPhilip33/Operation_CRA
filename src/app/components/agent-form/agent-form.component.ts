import { Component, computed } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Agent } from '../../interfaces/agent';
import { ToastComponent } from '../toast/toast.component';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';
import {
  addAgent,
  deleteActivityReport,
  deleteAgent,
  deleteLeave,
} from '../../store/signal-operations';
import {
  activityReportsSignal,
  agentsSignal,
  leavesSignal,
} from '../../store/signals';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.scss',
})
export class AgentFormComponent {
  agents: FormGroup;
  storedAgentsData: Agent[];
  storedActivityReports: ActivityReport[];
  storedLeaves: Leave[];
  errorMessage: string | null;
  formSubmitted: boolean = false;
  agentSignal = computed(() => agentsSignal());

  constructor(private fb: FormBuilder) {
    this.errorMessage = null;
    this.agents = this.fb.group({
      id: [0],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      leaveBalance: [5],
    });

    this.storedAgentsData = agentsSignal();
    this.storedActivityReports = activityReportsSignal();
    this.storedLeaves = leavesSignal();
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
    const activitiesToDelete = this.storedActivityReports.filter(
      (report) => Number(report.agentId) === Number(id)
    );
    activitiesToDelete.forEach((activity) => deleteActivityReport(activity.id));

    const leavesToDelete = this.storedLeaves.filter(
      (leave) => Number(leave.agentId) === Number(id)
    );
    leavesToDelete.forEach((leave) => deleteLeave(leave.id));

    deleteAgent(id);
  }

  onSubmit() {
    const storedAgents = this.storedAgentsData;

    this.agents.patchValue({
      id: storedAgents ? storedAgents.length : 0,
    });

    if (this.agents.valid) {
      this.errorMessage = null;
      addAgent(this.agents.value);
      this.agents.reset({
        leaveBalance: 5,
      });

      this.formSubmitted = true;
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }
}
