import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { Power } from 'src/app/api/entities/powers/types/power';
import { Validators } from '@angular/forms';

export const powerViewDescriptor = new EntityViewDescriptor<Power>({
  viewType: {
    typeName: 'Power',
    titleKey: 'name',
    permissions: {
      create: 'Manager.Rules',
      update: 'Manager.Rules',
      delete: 'Manager.Rules',
    }
  },
  infoGrid: {
    name: { sortable: true },
    book: { sortable: true },
    points: { sortable: true },
    duration: { sortable: true },
    distance: { sortable: true },
    rank: { sortable: true },
  },
  readForm: {
    book: {},
    points: {},
    duration: {},
    distance: {},
    rank: {},
    trappings: {},
    text: { addHorizontalRuler: true, hideLabel: true, encode: true },
  },
  editForm: {
    name: { validators: Validators.required },
    book: { validators: Validators.required },
    points: { validators: Validators.required },
    duration: { validators: Validators.required },
    distance: { validators: Validators.required },
    rank: { validators: Validators.required },
    trappings: {},
    text: {
      textarea: { initialRows: 12 },
      validators: Validators.required,
    },
  },
});
