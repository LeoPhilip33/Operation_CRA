import { createAction, props } from '@ngrx/store';

export const addAgent = createAction(
  '[Form] Add Agent',
  props<{
    agentData: {
      id: number;
      lastName: string;
      firstName: string;
      note: string;
    };
  }>()
);

export const addActivityReport = createAction(
  '[Form] Add Activity Report',
  props<{
    report: {
      project: string;
      startDate: Date;
      endDate: Date;
      activity: string;
      agentId: number;
    };
  }>()
);
