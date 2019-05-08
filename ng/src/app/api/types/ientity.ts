export type EntityKey = string | number;

export interface IEntity<TKey extends EntityKey = number> {
  // undefined, null, empty string, 0 - for transient (new) entity
  id?: TKey;
}
