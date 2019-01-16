export type TypeDescriptor<T, D> = {
  [P in keyof T]?: D;
};

export type ViewFieldDescriptor<T, V extends ViewField = ViewField> = TypeDescriptor<T, V>;


export interface ViewObjectDescriptor<T> {
  typeName: string;
  titleKey: keyof T;
  locale?: string; // contain locale already
  formFields?: ViewFieldDescriptor<T, FormField>;
  tableFields?: ViewFieldDescriptor<T, TableField>;
}


export interface ViewObject<T> {
  descriptor: ViewObjectDescriptor<T>;
  value: T;
}

export interface ViewField {
  label?: string;
}

export type FormFieldType = 'default' | 'hRuler';

export interface FormField extends ViewField {
  type?: FormFieldType;
}

export interface TableField extends ViewField {
  sortable?: boolean;
}