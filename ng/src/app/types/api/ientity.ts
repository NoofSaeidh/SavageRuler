export type EntityKey = string | number;

export interface IEntity<TKey extends EntityKey = number> {
  id: TKey;
}
