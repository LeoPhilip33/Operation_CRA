import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  format,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import { Legend } from '../../interfaces/legend';
import { Agent } from '../../interfaces/agent';
import { ActivityReport } from '../../interfaces/activity-report';
import { Leave } from '../../interfaces/leave';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  @Input() legends: Legend[] = [];
  @Input() agents: Agent[] = [];
  @Input() leaves: Leave[] = [];
  @Input() activityReports: ActivityReport[] = [];

  currentMonth: Date = new Date();
  days: Date[] = [];
  weeks: Date[][] = [];

  ngOnInit() {
    this.loadDays();
  }

  loadDays() {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const startWeek = start.getDay();
    const daysBeforeMonth = Array(startWeek).fill(null);
    const allDays = [...daysBeforeMonth, ...daysInMonth];

    this.weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      this.weeks.push(allDays.slice(i, i + 7));
    }
  }

  format(date: Date): string {
    return format(date, 'MMMM yyyy');
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

  getAgentById(agentId: number): Agent | undefined {
    return this.agents.find((agent) => Number(agent.id) === Number(agentId));
  }

  viewCra(activity: ActivityReport) {
    console.log('View CRA', activity);
  }

  getLeaveForDay(day: Date): Leave[] {
    if (!day) {
      return [];
    }

    return this.leaves.filter((leave) => {
      const startDate = parseISO(leave.startDate.toString());
      const endDate = parseISO(leave.endDate.toString());
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  }

  getActivityForDay(day: Date): ActivityReport[] {
    if (!day) {
      return [];
    }

    return this.activityReports.filter((report) => {
      const startDate = parseISO(report.startDate.toString());
      const endDate = parseISO(report.endDate.toString());
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  }
}
