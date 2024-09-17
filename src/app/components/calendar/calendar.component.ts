import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  format,
} from 'date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  currentMonth: Date = new Date();
  days: Date[] = [];
  weeks: Date[][] = [];

  ngOnInit() {
    this.loadDays();
  }

  loadDays() {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    const daysBefore = eachDayOfInterval({
      start: start,
      end: end,
    });

    const startWeek = start.getDay();
    const daysBeforeMonth = Array(startWeek).fill(null);
    const daysInMonth = [...daysBefore, ...daysBeforeMonth];

    this.weeks = [];
    for (let i = 0; i < daysInMonth.length; i += 7) {
      this.weeks.push(daysInMonth.slice(i, i + 7));
    }
  }

  prevMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.loadDays();
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.loadDays();
  }

  formatDay(date: Date): string {
    return format(date, 'd');
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }
}
