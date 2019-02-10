import { Entity } from './entity';

export interface Power extends Entity<number> {
  name: string;
  book?: string;
  points?: string;
  duration?: string;
  distance?: string;
  rank?: string;
  trappings?: string;
  text?: string;
}

