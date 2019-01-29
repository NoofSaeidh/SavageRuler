import {IEntity} from '../../../../types/api/ientity';

export interface Power extends IEntity<number> {
  name: string;
  book: string;
  points: string;
  duration: string;
  distance: string;
  rank: string;
  trappings: string;
  text: string;
}
