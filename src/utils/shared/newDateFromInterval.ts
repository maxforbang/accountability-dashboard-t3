import { addWeeks, addQuarters, addYears, subWeeks, subQuarters, subYears } from 'date-fns';

export function newDateFromInterval(date: Date, type: 'WEEK' | 'QUARTER' | 'YEAR', direction: 'increase' | 'decrease'): Date {
  switch (type) {
    case 'WEEK':
      return direction === 'increase' ? addWeeks(date, 1) : subWeeks(date, 1);
    case 'QUARTER':
      return direction === 'increase' ? addQuarters(date, 1) : subQuarters(date, 1);
    case 'YEAR':
      return direction === 'increase' ? addYears(date, 1) : subYears(date, 1);
    default:
      throw new Error('Invalid type specified.');
  }
}
