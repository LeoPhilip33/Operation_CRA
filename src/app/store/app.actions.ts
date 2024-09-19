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

export const addActivityReport = createAction(
  '[Form] Add Activity Report',
  props<{
    report: ActivityReport;
  }>()
);

export const addLeave = createAction(
  '[Form] Add Leave',
  props<{
    leaveData: Leave;
  }>()
);

export const updateActivityReport = createAction(
  '[Form] Update Activity Report',
  props<{
    id: number;
    report: Partial<ActivityReport>;
  }>()
);

export const updateLeave = createAction(
  '[Form] Update Leave',
  props<{
    id: number;
    leave: Partial<Leave>;
  }>()
);
