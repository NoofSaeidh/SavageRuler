import { IEntity, EntityKey } from '../api/ientity';

export class ViewDescriptor<
  T extends IEntity<TKey>,
  TKey extends EntityKey = number
> {}
