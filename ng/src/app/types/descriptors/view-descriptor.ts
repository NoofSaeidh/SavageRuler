import { TypeDescriptor } from './type-descriptor';
import { TypeEntry, toTypeEntries } from '../global/type-entry';
import { ValidatorFn, AbstractControlOptions } from '@angular/forms';

export interface ViewType<T> {
  typeName: string;
  titleKey: keyof T;
  // anonymous allowed by default
  permissions?: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
}

interface ViewTypeEntries<T, F> {
  viewType: ViewType<T>;
  entries: TypeEntry<T, F>[];
}

export interface ReadFormField {
  // if true null will be presented (undefined willl not be presented always)
  showNullValue?: boolean;
  // preformated?: boolean; // use <pre> instead of <p> for value
  addHorizontalRuler?: boolean;
  hideLabel?: boolean;
  encode?: boolean; // replace line breaks and tabs with html tags
}

export type ReadFormDescriptor<T> = TypeDescriptor<T, ReadFormField>;
export type ReadFormTypeEntries<T> = ViewTypeEntries<T, ReadFormField>;

export interface EditFormField {
  // addHorizontalRuler?: boolean; // rem?
  // hideLabel?: boolean; // rem?
  // encode?: boolean; // rem?
  textarea?: {
    initialRows?: number;
    // todo: autosize??
  };
  validators?: ValidatorFn | ValidatorFn[];
}

export type EditFormDescriptor<T> = TypeDescriptor<T, EditFormField>;
export type EditFormTypeEntries<T> = ViewTypeEntries<T, EditFormField>;

export interface InfoGridField {
  sortable?: boolean;
}

export type InfoGridDescriptor<T> = TypeDescriptor<T, InfoGridField>;
export type InfoGridTypeEntries<T> = ViewTypeEntries<T, InfoGridField>;

// todo: refactor constructor or use simple interface
export class EntityViewDescriptor<T> {
  readonly viewType: ViewType<T>;
  readonly readForm?: ReadFormDescriptor<T>;
  readonly editForm?: EditFormDescriptor<T>;
  readonly infoGrid?: InfoGridDescriptor<T>;
  constructor(input: {
    viewType: ViewType<T>;
    readForm?: ReadFormDescriptor<T>;
    editForm?: EditFormDescriptor<T>;
    infoGrid?: InfoGridDescriptor<T>;
  }) {
    this.viewType = input.viewType;
    this.readForm = input.readForm;
    this.editForm = input.editForm;
    this.infoGrid = input.infoGrid;
  }

  get infoGridTypeEntries(): InfoGridTypeEntries<T> {
    if (!this.infoGrid) {
      throw new Error('infoGrid is undefined');
    }
    return {
      viewType: this.viewType,
      entries: toTypeEntries(this.infoGrid),
    };
  }

  get readFormTypeEntries(): ReadFormTypeEntries<T> {
    if (!this.readForm) {
      throw new Error('readForm is undefined');
    }
    return {
      viewType: this.viewType,
      entries: toTypeEntries(this.readForm),
    };
  }

  get editFormTypeEntries(): EditFormTypeEntries<T> {
    if (!this.editForm) {
      throw new Error('readForm is undefined');
    }
    return {
      viewType: this.viewType,
      entries: toTypeEntries(this.editForm),
    };
  }
}
