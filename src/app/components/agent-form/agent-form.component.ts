import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Agent } from '../../interfaces/agent';
import { Store } from '@ngrx/store';
import { addForm } from '../../store/agent.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.scss',
})
export class AgentFormComponent {
  agents: FormGroup;
  forms$: Observable<Agent[]>;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ forms: Agent[] }>
  ) {
    this.errorMessage = null;
    this.agents = this.fb.group({
      lastName: [''],
      firstName: [''],
      note: [''],
    });

    this.forms$ = this.store.select((state) => state.forms);
  }

  onSubmit() {
    if (this.agents.valid) {
      this.errorMessage = null;
      this.store.dispatch(addForm({ formData: this.agents.value }));
      this.agents.reset();
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }
}
