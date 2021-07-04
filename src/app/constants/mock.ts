import { Account, Post, Provider, Date, Status } from './models';
export const pageSizeOptions: number[] = [2, 5, 10, 25, 100];

export const dates: Date[] = [
  {
    id: 0,
    title: 'All',
  },
  {
    id: 1,
    title: 'Today',
  },
  {
    id: 2,
    title: 'Yesterday',
  },
  {
    id: 3,
    title: 'This Week',
  },
  {
    id: 4,
    title: 'Last Week',
  },
  {
    id: 5,
    title: 'This Month',
  },
  {
    id: 6,
    title: 'Last Month',
  },
  {
    id: 7,
    title: 'Choose a Date',
  },
];
export const statuses: Status[] = [
  {
    id: 0,
    title: 'All',
  },
  {
    id: 1,
    title: 'Pending',
  },
  {
    id: 2,
    title: 'Published',
  },
];
export const providers: Provider[] = [
  {
    id: 0,
    title: 'All',
  },
  {
    id: 1,
    title: 'Facebook',
  },
  {
    id: 2,
    title: 'Instagram',
  },
  {
    id: 3,
    title: 'Linkedin',
  },
  {
    id: 4,
    title: 'Twitter',
  },
];
