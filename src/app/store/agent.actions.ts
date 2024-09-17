import { createAction, props } from '@ngrx/store';

export const addForm = createAction(
  '[Form] Add Form',
  props<{ formData: { lastName: string; firstName: string; note: string } }>()
);

export const addActivityReport = createAction(
  '[Form] Add Activity Report',
  props<{
    report: {
      location: string;
      startDate: Date;
      endDate: Date;
      activity: string;
    };
  }>()
);
