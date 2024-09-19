import { createReducer, on, Action } from '@ngrx/store';
import {
  addActivityReport,
  addAgent,
  addLeave,
  deleteActivityReport,
  deleteAgent,
  deleteLeave,
  updateActivityReport,
  updateLeave,
} from './app.actions';
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
    },
    {
      id: 1,
      lastName: 'Philip',
      firstName: 'Léo',
    },
    {
      id: 2,
      lastName: 'Dupont',
      firstName: 'Jean',
    },
  ],
  activityReports: [],
  leaves: [],
};

const _appReducer = createReducer(
  initialState,
  on(addAgent, (state, { agentData }) => ({
    ...state,
    agents: [...state.agents, agentData],
  })),
  on(deleteAgent, (state, { id }) => ({
    ...state,
    agents: state.agents.filter((agent) => agent.id !== id),
  })),

  on(addActivityReport, (state, { report }) => ({
    ...state,
    activityReports: [...state.activityReports, report],
  })),
  on(updateActivityReport, (state, { id, report }) => ({
    ...state,
    activityReports: state.activityReports.map((activityReport) =>
      activityReport.id === id
        ? { ...activityReport, ...report }
        : activityReport
    ),
  })),
  on(deleteActivityReport, (state, { id }) => ({
    ...state,
    activityReports: state.activityReports.filter(
      (activityReport) => activityReport.id !== id
    ),
  })),

  on(addLeave, (state, { leaveData }) => ({
    ...state,
    leaves: [...state.leaves, leaveData],
  })),
  on(updateLeave, (state, { id, leave }) => ({
    ...state,
    leaves: state.leaves.map((elementLeave) =>
      elementLeave.id === id ? { ...elementLeave, ...leave } : elementLeave
    ),
  })),
  on(deleteLeave, (state, { id }) => ({
    ...state,
    leaves: state.leaves.filter((elementLeave) => elementLeave.id !== id),
  }))
);

export function appReducer(state: AppState | undefined, action: Action) {
  return _appReducer(state, action);
}
