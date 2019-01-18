export type TypeDescriptor<T, D> = {
  [P in keyof T]?: D;
};

export type ViewFieldDescriptor<T, V extends ViewField = ViewField> = TypeDescriptor<T, V>;


export interface ViewObjectDescriptor<T> {
  typeName: string;
  titleKey: keyof T;
  locale?: string; // shows that descriptor is already localized
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

export interface FormField extends ViewField {
  showNullValue?: boolean; // if true null will be presented (undefined willl not be presented always)
  preformated?: boolean; // use <pre> instead of <p> for value
  addHorizontalRuler?: boolean;
  hideLabel?: boolean;
  encode?: boolean; // replace line breaks and tabs with html tags
}

export interface TableField extends ViewField {
  sortable?: boolean;
}


export interface ReadFieldValue {
  label?: string;
  value: any;
  labelClass?: string; // css class
  valueClass?: string; // css class
  preformated?: boolean; // use <pre> instead of <p> for value
  encodeValue?: boolean; // replace line breaks and tabs with html tags
  addHorizontalRuler?: boolean;
}

