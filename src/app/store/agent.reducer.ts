import { createReducer, on, Action } from '@ngrx/store';
import { addForm } from './agent.actions';
import { Agent } from '../interfaces/agent';

export const initialState: Agent[] = [];

const _formReducer = createReducer(
  initialState,
  on(addForm, (state, { formData }) => [...state, formData])
);

export function formReducer(state: Agent[] | undefined, action: Action) {
  return _formReducer(state, action);
}
