import { createAction, props } from '@ngrx/store';
import { Leave } from '../interfaces/leave';
import { ActivityReport } from '../interfaces/activity-report';
import { Agent } from '../interfaces/agent';

export const addAgent = createAction(
  '[Form] Add Agent',
  props<{
    agentData: Agent;
  }>()
);

export const updateAgent = createAction(
  '[Form] Update Agent',
  props<{
    agentData: Partial<Agent>;
  }>()
);

export const deleteAgent = createAction(
  '[Form] Delete Agent',
  props<{
    id: number;
  }>()
);

export const addLeave = createAction(
  '[Form] Add Leave',
  props<{
    leaveData: Leave;
  }>()
);

export const updateLeave = createAction(
  '[Form] Update Leave',
  props<{
    id: number;
    leave: Partial<Leave>;
  }>()
);

export const deleteLeave = createAction(
  '[Form] Delete Leave',
  props<{
    id: number;
  }>()
);

export const addActivityReport = createAction(
  '[Form] Add Activity Report',
  props<{
    report: ActivityReport;
  }>()
);

export const updateActivityReport = createAction(
  '[Form] Update Activity Report',
  props<{
    id: number;
    report: Partial<ActivityReport>;
  }>()
);

export const deleteActivityReport = createAction(
  '[Form] Delete Activity Report',
  props<{
    id: number;
  }>()
);
