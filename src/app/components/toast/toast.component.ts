import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { onIdentifyEffectsKey } from '@ngrx/effects/src/lifecycle_hooks';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  @Input() toastMessage: string | null = null;
  @Output() isToastClosed = new EventEmitter<boolean>(false);

  closeToast() {
    this.toastMessage = null;
    this.isToastClosed.emit(true);
  }

  ngOnInit(): void {
    setTimeout(() => this.closeToast(), 5000);
  }
}
