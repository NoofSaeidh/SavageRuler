import { Dictionary, EntryKey } from 'src/app/types/global/dictionary';

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
