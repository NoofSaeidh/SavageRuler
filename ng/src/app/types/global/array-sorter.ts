// todo: write sorter

// class ArraySorter {
//   sortBy<T>(
//     array: T[],
//     by: keyof T,
//     options?: { caseInsensetive: boolean; ascending: boolean },
//   ): T[] {
//     if (!options) {
//       options = {
//         caseInsensetive: false,
//         ascending: true,
//       };
//     }
//     // todo: is it ok?
//     const sort = array.map((value, index) => {
//       const val = value[by];
//       let order: [number, string];
//       if (val === undefined) {
//         order = [-10, ''];
//       } else if (val === null) {
//         order = [-5, ''];
//       } else if (typeof val === 'number') {
//         order = [5, val + ''];
//       } else if (typeof val === 'string') {
//         if (options.caseInsensetive) {
//           order = [10, val.toLowerCase()];
//         } else {
//           order = [10, val];
//         }
//       } else {
//         order = [-20, JSON.stringify(val)];
//       }
//       return {
//         index,
//         order,
//       };
//     });

//     sort.sort((left, right) => {
//       if (left.order[0] > right.order[0]) {
//         return options.ascending ? 1 : -1;
//       }

//     });
//   }
// }

// export const arraySorter = new ArraySorter();
