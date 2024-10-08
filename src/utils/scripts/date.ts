import { endOfMonth, parse } from 'date-fns';

/**
 * Returns the last day of the month given the month name and year.
 *
 * @param {string} monthName - The name of the month.
 * @param {number} [year] - The year. Defaults to the current year.
 *
 * @return {Date}
 */
export function getDateFromMonth(
  monthName: string,
  year = new Date().getFullYear(),
) {
  const month = monthName.trim();
  const dateString = `${month} 1, ${year}`;
  const firstOfMonth = parse(dateString, 'MMMM d, yyyy', new Date());

  if (firstOfMonth.toString() === 'Invalid Date') {
    throw new Error('Invalid time value');
  }

  const endOfMonthDate = endOfMonth(firstOfMonth);

  endOfMonthDate.setUTCHours(0, 0, 0, 0);
  return endOfMonthDate;
}
