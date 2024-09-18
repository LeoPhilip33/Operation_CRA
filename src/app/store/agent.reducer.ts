import { createReducer, on, Action } from '@ngrx/store';
import {
  addActivityReport,
  addAgent,
  addLeave,
  updateActivityReport,
} from './agent.actions';
import { Agent } from '../interfaces/agent';
import { ActivityReport } from '../interfaces/activity-report';
import { Leave } from '../interfaces/leave';

export interface AppState {
  agents: Agent[];
  activityReports: ActivityReport[];
  leaves: Leave[];
}

export const initialState: AppState = {
  agents: [],
  activityReports: [],
  leaves: [],
};

const _appReducer = createReducer(
  initialState,
  on(addAgent, (state, { agentData }) => ({
    ...state,
    agents: [...state.agents, agentData],
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
  on(addLeave, (state, { leaveData }) => ({
    ...state,
    leaves: [...state.leaves, leaveData],
  }))
);

export function appReducer(state: AppState | undefined, action: Action) {
  return _appReducer(state, action);
}
