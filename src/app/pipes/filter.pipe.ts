import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash/fp';

@Pipe({
  name: 'filter',
})
// export class FilterPipe implements PipeTransform {
//   transform(items: any, filter: any): any {
//     if (filter && Array.isArray(items)) {
//       const filterKeys = Object.keys(filter);
//
//       return items.filter((item) =>
//         filterKeys.reduce(
//           (memo, keyName) => (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '',
//           true
//         )
//       );
//     } else {
//       return items;
//     }
//   }
// }

export class FilterPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items) && Object.keys(filter).length > 0) {
      console.log(items);
      console.log(_.filter(items, { 'posted': false }));
      return _.filter(items, filter);
    } else {
      return items;
    }
    // if (filter && Array.isArray(items)) {
    //   const filterKeys = Object.keys(filter);
    //
    //   return items.filter((item) =>
    //     filterKeys.reduce(
    //       (memo, keyName) => (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '',
    //       true
    //     )
    //   );
    // } else {
    //   return items;
    // }
  }
}
