import { createReducer, on, Action } from '@ngrx/store';
import { addActivityReport, addForm } from './agent.actions';
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

const _formReducer = createReducer(
  initialState,
  on(addForm, (state, { formData }) => ({
    ...state,
    agents: [...state.agents, formData],
  })),
  on(addActivityReport, (state, { report }) => ({
    ...state,
    activityReports: [...state.activityReports, report],
  }))
);

export function formReducer(state: AppState | undefined, action: Action) {
  return _formReducer(state, action);
}
