import { Dictionary, EntryKey } from 'src/app/types/global/dictionary';
import { StringHelper } from 'src/app/types/global/string-helper';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiMethod {
  // relative url
  url: string;
  httpMethod: HttpMethod;
}

export interface ApiController<TKey extends EntryKey = string> {
  name: string;
  methods: Dictionary<ApiMethod, TKey>;
}

export function buildApiMethods<TKey extends string>(
  names: string[],
  options: {
    prefix: string;
    httpMethod?: HttpMethod; // default GET
    capitalize?: boolean;
  },
): Dictionary<ApiMethod, TKey> {
  const result = {};
  for (const name of names) {
    result[name as string] = buildApiMethod(name, options);
  }
  return result as Dictionary<ApiMethod, TKey>;
}

export function buildApiMethodsExtra<TKey extends string>(
  prefix: string,
  ...args: {name: string; httpMethod: HttpMethod}[]
): Dictionary<ApiMethod, TKey> {
  const result = {};
  for (const {name, httpMethod} of args) {
    result[name as string] = buildApiMethod(name, {prefix, httpMethod});
  }
  return result as Dictionary<ApiMethod, TKey>;
}

export function buildApiMethod(
  name: string,
  options: {
    prefix: string;
    httpMethod?: HttpMethod; // default GET
    capitalize?: boolean;
  },
): ApiMethod {
  return {
    httpMethod: options.httpMethod || 'GET',
    url:
      options.prefix +
      (options.capitalize ? StringHelper.capitalize(name) : name),
  };
}
