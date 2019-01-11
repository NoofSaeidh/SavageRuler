// todo: refactor for better join with real objects
export interface ViewField {
  key: string;
  label?: string;
  // should be only one for entity
  isTitle?: boolean;
}

export interface ViewFieldValue<T extends ViewField = ViewField> {
  field: T;
  value: any;
}

export interface FormField extends ViewField {
  type?: any; // todo: handle this
}

export interface TableField extends ViewField {
  sortable?: boolean;
}
