import { Dictionary, Route } from 'vue-router/types/router';
import { typeConverter } from '@/helpers/type-converter';

// todo: handle arrays
export type QueryType = 'string' | 'float' | 'int' | 'boolean';

export interface QeuryProperty {
  property: string;
  type: QueryType;
}

export type RawQueryProperty = string | QeuryProperty;

export class QueryHelper {
  parseQuery(query: Dictionary<string | string[]>, ...props: RawQueryProperty[]): object {
    if (!props) {
      return query;
    }
    const result: Dictionary<any> = {};
    for (const prop of props) {
      let propName: string;
      let value: string | number | boolean;
      if (typeof prop === 'string') {
        propName = prop;
        // todo: arrays!
        value = query[propName] as string;
      } else {
        if (typeof prop.property !== 'string') {
          continue;
        }
        propName = prop.property;
        // todo: arrays!
        const qValue = query[propName] as string;
        if (prop.type && qValue !== undefined || null) {
          switch (prop.type) {
            case 'float':
              value = parseFloat(qValue);
              break;
            case 'int':
              value = parseInt(qValue, 10);
              break;
            case 'boolean':
              value = typeConverter.parseBoolean(qValue);
              break;
            case 'string':
            default:
              value = qValue;
          }
        } else {
          value = qValue;
        }
      }
      result[propName] = value;
    }
    return result;
  }

  mapRoute(...props: RawQueryProperty[]): (route: Route) => object {
    return route => this.parseQuery(route.query, ...props);
  }
}

export const queryHelper = new QueryHelper();
