export interface Table {
  headers: TableHeader[];
  data: any[];
}

export interface TableHeader {
  key: string;
  label?: string;
  sortable?: boolean;
}
