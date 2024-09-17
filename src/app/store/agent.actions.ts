import { createAction, props } from '@ngrx/store';

export const addForm = createAction(
  '[Form] Add Form',
  props<{ formData: { lastName: string; firstName: string; note: string } }>()
);
