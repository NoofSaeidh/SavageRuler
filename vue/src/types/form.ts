import { ViewField } from './view-field';

export interface FormField extends ViewField {
  type?: any; // todo: handle this
}

export interface FormFieldValue {
  value: any;
  field: FormField;
}

export function convertObjToFormFields(
  value: object,
  fields: FormField[],
): FormFieldValue[] {
  return fields.map(f => ({ field: f, value: value[f.key as keyof (object)] }));
}
