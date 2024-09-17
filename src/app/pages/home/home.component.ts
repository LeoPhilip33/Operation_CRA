import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addForm } from '../../store/agent.actions';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Agent } from '../../interfaces/agent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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
