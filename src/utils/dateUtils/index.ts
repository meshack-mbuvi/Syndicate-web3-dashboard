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
import { registerLocale } from "react-datepicker";
import { format, utcToZonedTime } from "date-fns-tz";

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

export const getUnixTimeFromDate = (date: Date): number =>
  Math.round(new Date(date).getTime() / 1000);

export const convertTime12to24 = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours}:${minutes}`;
};

/**
 * This method creates a locale object based off of date-fns
 * @param {*} localeString A string denoting the user's locale
 * @returns {object} a locale object base off the locale string
 */
export const getLocaleObject = (localeString) => {
  const locales = {
    af: af,
    arDZ: arDZ,
    arMA: arMA,
    arSA: arSA,
    az: az,
    be: be,
    bg: bg,
    bn: bn,
    bs: bs,
    ca: ca,
    cs: cs,
    cy: cy,
    da: da,
    de: de,
    "de-AT": deAT,
    el: el,
    "en-AU": enAU,
    "en-CA": enCA,
    "en-GB": enGB,
    "en-IN": enIN,
    "en-NZ": enNZ,
    "en-US": enUS,
    "en-ZA": enZA,
    eo: eo,
    es: es,
    et: et,
    eu: eu,
    "fa-IR": faIR,
    fi: fi,
    fr: fr,
    frCA: frCA,
    "fr-CH": frCH,
    gd: gd,
    gl: gl,
    gu: gu,
    he: he,
    hi: hi,
    hr: hr,
    ht: ht,
    hu: hu,
    hy: hy,
    id: id,
    is: is,
    it: it,
    ja: ja,
    ka: ka,
    kk: kk,
    kn: kn,
    ko: ko,
    lb: lb,
    lt: lt,
    lv: lv,
    mk: mk,
    mn: mn,
    ms: ms,
    mt: mt,
    nb: nb,
    nl: nl,
    "nl-BE": nlBE,
    nn: nn,
    pl: pl,
    pt: pt,
    "pt-BR": ptBR,
    ro: ro,
    ru: ru,
    sk: sk,
    sl: sl,
    sq: sq,
    sr: sr,
    "sr-Latn": srLatn,
    sv: sv,
    ta: ta,
    te: te,
    th: th,
    tr: tr,
    ug: ug,
    uk: uk,
    uz: uz,
    vi: vi,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
  };
  for (const [key, value] of Object.entries(locales)) {
    registerLocale(key, value);
  }
  return localeString in locales ? locales[localeString] : locales["en-US"];
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
