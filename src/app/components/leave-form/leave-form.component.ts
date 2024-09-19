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
import { addLeave, updateLeave } from '../../store/app.actions';
import { Observable, take, tap } from 'rxjs';
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
export class LeaveFormComponent implements OnInit {
  @Input() selectedLeave: Leave | null = null;
  @Output() isLeaveUpdated = new EventEmitter<boolean>(false);

  leave: FormGroup;
  storedAgents$: Observable<Agent[]>;
  storedLeaves$: Observable<Leave[]>;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{
      app: { leaves: Leave[]; agents: Agent[] };
    }>
  ) {
    this.leave = this.fb.group(
      {
        id: [0],
        agentId: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        reason: [null, Validators.required],
      },
      {
        validators: this
          .dateRangeValidator as AbstractControlOptions['validators'],
      } as AbstractControlOptions
    );

    this.storedAgents$ = this.store.select((state) => state.app.agents);
    this.storedLeaves$ = this.store.select((state) => state.app.leaves);
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

  get reason() {
    return this.leave.get('reason');
  }

  ngOnInit(): void {
    if (this.selectedLeave) {
      this.leave.patchValue(this.selectedLeave);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.leave.get(field);
    return (control?.invalid && (control?.touched || control?.dirty)) ?? false;
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

  onSubmit() {
    if (this.leave.valid) {
      this.errorMessage = null;

      if (this.selectedLeave) {
        this.store.dispatch(
          updateLeave({ id: this.selectedLeave.id, leave: this.leave.value })
        );

        this.isLeaveUpdated.emit(true);
      } else {
        this.storedLeaves$
          .pipe(
            take(1),
            tap((leaves) => {
              this.leave.patchValue({ id: leaves ? leaves.length : 0 });
              this.store.dispatch(addLeave({ leaveData: this.leave.value }));
              this.leave.reset();
            })
          )
          .subscribe();
      }
    } else {
      this.errorMessage = 'Vérifier les champs du formulaire';
    }
  }
}
