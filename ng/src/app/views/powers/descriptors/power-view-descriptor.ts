import { ViewDescriptor } from 'src/app/types/descriptors/view-descriptor';
import { Power } from 'src/app/api/entities/powers/descriptors/power';

export const powerViewDescriptor = new ViewDescriptor<Power>(
  'Power',
  'name',
  {
    book: {},
    points: {},
    duration: {},
    distance: {},
    rank: {},
    trappings: {},
    text: { addHorizontalRuler: true, hideLabel: true, encode: true },
  },
  {
    name: { sortable: true },
    book: { sortable: true },
    points: { sortable: true },
    duration: { sortable: true },
    distance: { sortable: true },
    rank: { sortable: true },
  },
);
