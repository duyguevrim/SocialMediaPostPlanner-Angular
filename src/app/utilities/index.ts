import {  Post } from '../constants/models';
import { filter } from 'rxjs/operators';
import { endOfWeek, format, subDays } from 'date-fns';
import startOfWeek from 'date-fns/startOfWeek';
import { tr } from 'date-fns/locale';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';

const getEpochToString = (date: string, f: string): string => {
  const d = new Date(0);
  d.setUTCSeconds(Number(date));
  return format(d, f);
};

const getDateToString = (date: string | Date, f: string): string => {
  const d = new Date(date);
  return format(d, f);
};

// const dateToEpoch = (date: string | Date, f: string): string => {
//   const d = new Date(date);
//   return format(d, f);
// };

const getProviderColor = (provider: string): string => {
  if (provider === 'facebook') {
    return '#1877f2';
  }
  if (provider === 'instagram') {
    return '#C13584';
  }
  if (provider === 'linkedin') {
    return '#1877f2';
  }
  if (provider === 'twitter') {
    return 'rgba(29,161,242,1.00)';
  }
};

const getProviderLimit = (provider: string): number => {
  if (provider === 'facebook') {
    return 5000;
  }
  if (provider === 'twitter') {
    return 280;
  }
  if (provider === 'linkedin') {
    return 1300;
  }
};

const trimString = (value: string, maxCharLength: number): string => {
  if (value.length > maxCharLength) {
    return value.slice(0, maxCharLength) + '...';
  } else {
    return value;
  }
};
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'success':
      return '#1BC5BD';
      break;
    case 'fail':
      return '#F64E60';
      break;
    default:
      return '#000000';
      break;
  }
};
const getPlanColor = (plan: string): string => {
  switch (plan) {
    case 'Free':
      return '#bbbbbb';
      break;
    case 'Pro':
      return '#1BC5BD';
      break;
    default:
      return '#000000';
      break;
  }
};
const search = (filterObject, posts): Post => {
  const filterKeys = Object.keys(filterObject);
  let filteredPosts;
  if (!filterKeys.includes('date')) {

    filteredPosts = posts.filter((post) =>
      filterKeys.reduce((memo, keyName) => (memo && new RegExp(filter[keyName], 'gi').test(post[keyName])) || filter[keyName] === '', true)
    );
  }

  if (filterKeys.includes('date')) {
    const today = format(new Date(), 'dd/MM/yyyy');
    const yesterday = format(subDays(new Date(), 1), 'dd/MM/yyyy');
    const startCurrentWeekDay = Number(format(startOfWeek(new Date(), {
      locale: tr,
      weekStartsOn: 1 /* 0 Pazar */
    }), 'dd'));
    const endCurrentWeekDay = Number(format(endOfWeek(new Date(), {
      locale: tr,
      weekStartsOn: 1 /* 0 Pazar */
    }), 'dd'));
    const LastDayCurrentMonth = Number(format(lastDayOfMonth(new Date()), 'dd'));
    const currentWeekIndex = Number(format(new Date(), 'w')) - 1;

    switch (filterObject.date) {
      case 1: // today
        filteredPosts = posts.filter((post) => getEpochToString(post.date, 'dd/MM/yyyy') === today);
        break;
      case 2: // yesterday
        filteredPosts = posts.filter((post) => getEpochToString(post.date, 'dd/MM/yyyy') === yesterday);
        break;
      case 3: // this week
        filteredPosts = posts.filter((post) => {
          const year = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[2]);
          const month = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[1]);
          const day = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[0]);
          const postDate = new Date(year, month, day);
          return postDate >= new Date(Number(today.split('/')[2]), Number(today.split('/')[1]), startCurrentWeekDay)
            && postDate <= new Date(Number(today.split('/')[2]), Number(today.split('/')[1]), endCurrentWeekDay);
        });
        break;
      case 4: // last week
        filteredPosts = posts.filter((post) => {

          const year = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[2]);
          const month = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[1]);
          const day = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[0]);

          const postDate = new Date(year, month - 1, day);
          const postWeek = Number(format(postDate, 'w')) - 1;
          return postWeek === currentWeekIndex - 1 && year === new Date().getFullYear();
        });
        break;
      case 5: // this month
        filteredPosts = posts.filter((post) => {
          const year = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[2]);
          const month = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[1]);
          const day = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[0]);
          const postDate = new Date(year, month, day);
          return postDate >= new Date(Number(today.split('/')[2]), Number(today.split('/')[1]), 1)
            && postDate <= new Date(Number(today.split('/')[2]), Number(today.split('/')[1]), LastDayCurrentMonth);
        });
        break;
      case 6: // last month
        filteredPosts = posts.filter((post) => {
          const year2 = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[2]);
          const month2 = Number(getEpochToString(post.date, 'dd/MM/yyyy').split('/')[1]);

          return year2 === new Date().getFullYear() && month2 === new Date().getMonth();
        });

        break;
      case 7: // spesific date
        console.log('choose a date');
        break;

      default:
        console.log('did not found');
        break;
    }
    // delete filterObject.date;
  }
  return filteredPosts;
};

export {
  search,
  getProviderColor,
  getProviderLimit,
  trimString,
  getStatusColor,
  getEpochToString,
  getDateToString,
  getPlanColor
};
