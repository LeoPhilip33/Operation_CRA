import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { addAgent, deleteAgent } from '../../store/app.actions';
import { CommonModule } from '@angular/common';
import { take, tap } from 'rxjs';
import { Agent } from '../../interfaces/agent';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.scss',
})
export class AgentFormComponent {
  agents: FormGroup;
  agentsData$: Observable<Agent[]>;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: { agents: Agent[] };
    }>
  ) {
    this.errorMessage = null;
    this.agents = this.fb.group({
      id: [0],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.agentsData$ = this.store.select((state) => state.app.agents);
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
    this.store.dispatch(deleteAgent({ id }));
  }

  onSubmit() {
    this.agentsData$
      .pipe(
        take(1),
        tap((agents) => {
          this.agents.patchValue({
            id: agents ? agents.length : 0,
          });

          if (this.agents.valid) {
            this.errorMessage = null;
            this.store.dispatch(addAgent({ agentData: this.agents.value }));
            this.agents.reset();
          } else {
            this.errorMessage = 'Form is invalid';
          }
        })
      )
      .subscribe();
  }
}
