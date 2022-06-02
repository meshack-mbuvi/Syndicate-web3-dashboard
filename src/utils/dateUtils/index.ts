import { format, utcToZonedTime } from 'date-fns-tz';
import moment from 'moment';
import { default as _moment } from 'moment-timezone';
import 'moment-precise-range-plugin';

export const formatDate = (dateString: Date): string =>
  dateString.toLocaleDateString();

/**
 * This method checks whether the provided date is in the past or not.
 * This function can be used to determine whether deposits are enabled or not.
 * Deposits are disabled if closeDate has not been reached.
 * @param {*} date close date
 * @returns {boolean}
 */
export const pastDate = (date: Date): boolean => {
  try {
    const currentDate = Date.now();
    return currentDate > date.getTime();
  } catch (error) {
    return false;
  }
};

export const epochTimeToDateFormat = (
  date: Date,
  dateFormat?: string
): string => {
  // get timezone from browser
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = utcToZonedTime(date, timezone);

  return format(formattedDate, dateFormat, {
    timeZone: timezone
  });
};

/**
 *
 * @param date epoch date string
 * @returns
 */
export const getCountDownDays = (date: string): string => {
  const now = moment();
  const closeDateCountdown = moment(new Date(parseInt(date)), 'M/DD/YYYY');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { years, months, days, hours, minutes, seconds } = moment.preciseDiff(
    now,
    closeDateCountdown,
    true
  );
  let timeRemaining = '';

  if (years) {
    timeRemaining += `${years} ${years > 1 ? 'years' : 'year'} `;
  }
  if (months) {
    timeRemaining += `${months} ${months > 1 ? 'months' : 'month'} `;
  }
  if (days) {
    timeRemaining += `${days} ${days > 1 ? 'days' : 'day'} `;
  }
  if (hours && days < 1) {
    timeRemaining += `${hours} ${hours === 1 ? 'hour' : 'hours'} `;
  }
  if (minutes && hours < 1 && days < 1) {
    timeRemaining += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} `;
  }
  if (
    seconds &&
    minutes < 1 &&
    years <= 0 &&
    months <= 0 &&
    days <= 0 &&
    hours <= 0
  ) {
    timeRemaining += `${seconds} ${seconds === 1 ? 'second' : 'seconds'} `;
  }
  return timeRemaining;
};
/** method to format UTC time into the sample format below
 * Friday, May 6 at 1:46pm CET
 * Method uses moment timezone https://momentjs.com/timezone/
 */

export const getFormattedDateTimeWithTZ = (date: number): string => {
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return _moment(date).tz(timeZoneString).format('dddd, MMM D [at] h:mma zz');
};
