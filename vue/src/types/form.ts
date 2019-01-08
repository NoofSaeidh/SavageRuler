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

// todo: temp
// tslint:disable-next-line: max-classes-per-file
export class CurrentItem<T> {
  public item: T | null = null;
  public fields: FormField[] | null = null;
  public get fieldValues() {
    if (!this.item || !this.fields) {
      throw {
        message: '"item" or "fields" is not initialized',
      };
    }
    return FormFieldValue.parse(this.item as unknown as object, this.fields);
  }
}
