import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { addAgent } from '../../store/agent.actions';
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
      lastName: [''],
      firstName: [''],
      note: [''],
    });

    this.agentsData$ = this.store.select((state) => state.app.agents);
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
