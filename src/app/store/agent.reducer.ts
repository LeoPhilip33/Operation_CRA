import { createReducer, on, Action } from '@ngrx/store';
import { addActivityReport, addAgent } from './agent.actions';
import { Agent } from '../interfaces/agent';
import { ActivityReport } from '../interfaces/activity-report';

export interface AppState {
  agents: Agent[];
  activityReports: ActivityReport[];
}

export const initialState: AppState = {
  agents: [],
  activityReports: [],
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
  }))
);

export function appReducer(state: AppState | undefined, action: Action) {
  return _appReducer(state, action);
}
