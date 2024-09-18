import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { LeaveFormComponent } from '../../components/leave-form/leave-form.component';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [HeaderComponent, LeaveFormComponent],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss',
})
export class LeaveComponent {}
