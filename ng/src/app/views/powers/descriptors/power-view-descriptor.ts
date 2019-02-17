import { EntityViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { Power } from 'src/app/api/entities/powers/descriptors/power';

export const powerViewDescriptor = new EntityViewDescriptor<Power>({
  viewType: {
    typeName: 'Power',
    titleKey: 'name',
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
});
