export interface FormField {
  key: string;
  label: string;
  type?: any; // todo: handle this
}

export class FormFieldValue {
  public static parse(value: object, fields: FormField[]): FormFieldValue[] {
    return fields.map(
      f => new FormFieldValue(f, value[f.key as keyof (object)]),
    );
  }
  constructor(public field: FormField, public value: any) {}
}
