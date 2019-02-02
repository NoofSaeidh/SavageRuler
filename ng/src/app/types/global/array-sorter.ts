class ArraySorter {
  simpleSortBy<T>(array: T[], by: keyof T, descending?: boolean): void {
    array.sort((a, b) => this.compare(a[by], b[by], descending));
  }

  sortBy<T>(array: T[], by: keyof T, descending?: boolean): void {
    array.sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return this.compare(a, b, descending);
      }
      return this.stringCompare(String(a[by]), String(b[by]), descending);
    });
  }

  private compare(a: any, b: any, descending?: boolean): number {
    if (a > b) {
      return descending ? 1 : -1;
    }
    if (a < b) {
      return descending ? -1 : 1;
    }
    return 0;
  }

  private stringCompare(a: string, b: string, descending?: boolean): number {
    return (
      a.localeCompare(b, undefined, {
        numeric: true
      }) * (descending ? -1 : 1)
    );
  }
}

export const arraySorter = new ArraySorter();
