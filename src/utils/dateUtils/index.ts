import { format, utcToZonedTime } from "date-fns-tz";
import {
  af,
  arDZ,
  arMA,
  arSA,
  az,
  be,
  bg,
  bn,
  bs,
  ca,
  cs,
  cy,
  da,
  de,
  deAT,
  el,
  enAU,
  enCA,
  enGB,
  enIN,
  enNZ,
  enUS,
  enZA,
  eo,
  es,
  et,
  eu,
  faIR,
  fi,
  fr,
  frCA,
  frCH,
  gd,
  gl,
  gu,
  he,
  hi,
  hr,
  ht,
  hu,
  hy,
  id,
  is,
  it,
  ja,
  ka,
  kk,
  kn,
  ko,
  lb,
  lt,
  lv,
  mk,
  mn,
  ms,
  mt,
  nb,
  nl,
  nlBE,
  nn,
  pl,
  pt,
  ptBR,
  ro,
  ru,
  sk,
  sl,
  sq,
  sr,
  srLatn,
  sv,
  ta,
  te,
  th,
  tr,
  ug,
  uk,
  uz,
  vi,
  zhCN,
  zhTW,
} from "date-fns/locale";
import moment from "moment";
import "moment-precise-range-plugin";
import { registerLocale } from "react-datepicker";

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
  dateFormat?: string,
): string => {
  // get timezone from browser
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = utcToZonedTime(date, timezone);
  return format(formattedDate, dateFormat, {
    timeZone: timezone,
  });
};

/**
 *
 * @param date epoch date string
 * @returns
 */
export const getCountDownDays = (date: string): string => {
  const now = moment();
  const closeDateCountdown = moment(new Date(parseInt(date)), "M/DD/YYYY");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { years, months, days, hours, minutes, seconds } = moment.preciseDiff(
    now,
    closeDateCountdown,
    true,
  );
  let timeRemaining = "";

  if (years) {
    timeRemaining += `${years} ${years > 1 ? "years" : "year"} `;
  }
  if (months) {
    timeRemaining += `${months} ${months > 1 ? "months" : "month"} `;
  }
  if (days) {
    timeRemaining += `${days} ${days > 1 ? "days" : "days"} `;
  }
  if (hours && days < 1) {
    timeRemaining += `${hours} ${hours === 1 ? "hour" : "hours"} `;
  }
  if (minutes && hours < 1 && days < 1) {
    timeRemaining += `${minutes} ${minutes === 1 ? "minute" : "minutes"} `;
  }
  if (
    seconds &&
    minutes < 1 &&
    years <= 0 &&
    months <= 0 &&
    days <= 0 &&
    hours <= 0
  ) {
    timeRemaining += `${seconds} ${seconds === 1 ? "second" : "seconds"} `;
  }
  return timeRemaining;
};
