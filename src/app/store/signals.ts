import { signal } from '@angular/core';
import { Agent } from '../interfaces/agent';
import { ActivityReport } from '../interfaces/activity-report';
import { Leave } from '../interfaces/leave';

export interface AppState {
  agents: Agent[];
  activityReports: ActivityReport[];
  leaves: Leave[];
}

export const initialState: AppState = {
  agents: [
    {
      id: 0,
      lastName: 'Doe',
      firstName: 'John',
      leaveBalance: 5,
    },
    {
      id: 1,
      lastName: 'Philip',
      firstName: 'Léo',
      leaveBalance: 5,
    },
    {
      id: 2,
      lastName: 'Dupont',
      firstName: 'Jean',
      leaveBalance: 5,
    },
  ],
  activityReports: [
    {
      id: 0,
      agentId: 0,
      project: 'Project Test',
      startDate: new Date(new Date().setDate(new Date().getDate() - 20)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      activity: 'Development work on Project Test',
    },
    {
      id: 1,
      agentId: 1,
      project: 'Project Alpha',
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      activity: 'Development work on Project Alpha',
    },
    {
      id: 2,
      agentId: 2,
      project: 'Project Beta',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      activity: 'Testing and QA for Project Beta',
    },
  ],
  leaves: [
    {
      id: 0,
      agentId: 0,
      startDate: new Date(new Date().setDate(new Date().getDate() + 17)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      type: 'paid-leave',
    },
    {
      id: 1,
      agentId: 1,
      startDate: new Date(new Date().setDate(new Date().getDate() - 20)),
      endDate: new Date(new Date().setDate(new Date().getDate() - 15)),
      type: 'paid-leave',
    },
    {
      id: 2,
      agentId: 2,
      startDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 18)),
      type: 'sick',
    },
  ],
};

export const agentsSignal = signal<Agent[]>(initialState.agents);
export const activityReportsSignal = signal<ActivityReport[]>(
  initialState.activityReports
);
export const leavesSignal = signal<Leave[]>(initialState.leaves);
