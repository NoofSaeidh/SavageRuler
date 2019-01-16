import { Power } from '@/types/power';
import { ViewFieldDescriptor, FormField, TableField, ViewObjectDescriptor } from '@/types/view-object';

const formFields: ViewFieldDescriptor<Power, FormField> = {
  name: {},
  book: {},
  points: {},
  duration: {},
  distance: {},
  rank: {},
  trappings: {},
  text: {addHorizontalRuler: true, hideLabel: true, encode: true},
};

const tableFields: ViewFieldDescriptor<Power, TableField> = {
  name: { sortable: true },
  book: { sortable: true },
  points: { sortable: true },
  duration: { sortable: true },
  distance: { sortable: true },
  rank: { sortable: true },
};

export const PowerDescriptor: ViewObjectDescriptor<Power> = {
  typeName: 'Power',
  titleKey: 'name',
  formFields,
  tableFields,
};

