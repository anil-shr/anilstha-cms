import NepaliDate, { dateConfigMap } from 'nepali-date-converter';

export interface NepaliMonth {
  index: number; // 0 to 11
  nameEn: string;
  nameNp: string;
  altNameNp?: string;
  shortEn: string;
}

export interface GregorianMonth {
  index: number; // 0 to 11
  nameEn: string;
  shortEn: string;
}

export interface Weekday {
  index: number; // 0 to 6 (0 = Sunday)
  nameEn: string;
  nameNp: string;
  translitNp: string;
  shortEn: string;
  shortNp: string;
}

export const NEPALI_MONTHS: NepaliMonth[] = [
  { index: 0, nameEn: 'Baishakh', nameNp: 'वैशाख', shortEn: 'Bai' },
  { index: 1, nameEn: 'Jestha', nameNp: 'जेठ', altNameNp: 'ज्येष्ठ', shortEn: 'Jes' },
  { index: 2, nameEn: 'Ashadh', nameNp: 'असार', altNameNp: 'आषाढ', shortEn: 'Asar' },
  { index: 3, nameEn: 'Shrawan', nameNp: 'साउन', altNameNp: 'श्रावण', shortEn: 'Shra' },
  { index: 4, nameEn: 'Bhadra', nameNp: 'भदौ', altNameNp: 'भाद्र', shortEn: 'Bhad' },
  { index: 5, nameEn: 'Ashwin', nameNp: 'असोज', altNameNp: 'आश्विन', shortEn: 'Asw' },
  { index: 6, nameEn: 'Kartik', nameNp: 'कात्तिक', altNameNp: 'कार्तिक', shortEn: 'Kar' },
  { index: 7, nameEn: 'Mangsir', nameNp: 'मङ्सिर', altNameNp: 'मार्गशीर्ष', shortEn: 'Mang' },
  { index: 8, nameEn: 'Poush', nameNp: 'पुस', altNameNp: 'पौष', shortEn: 'Pou' },
  { index: 9, nameEn: 'Magh', nameNp: 'माघ', shortEn: 'Magh' },
  { index: 10, nameEn: 'Falgun', nameNp: 'फागुन', altNameNp: 'फाल्गुन', shortEn: 'Fal' },
  { index: 11, nameEn: 'Chaitra', nameNp: 'चैत', altNameNp: 'चैत्र', shortEn: 'Chai' },
];

export const GREGORIAN_MONTHS: GregorianMonth[] = [
  { index: 0, nameEn: 'January', shortEn: 'Jan' },
  { index: 1, nameEn: 'February', shortEn: 'Feb' },
  { index: 2, nameEn: 'March', shortEn: 'Mar' },
  { index: 3, nameEn: 'April', shortEn: 'Apr' },
  { index: 4, nameEn: 'May', shortEn: 'May' },
  { index: 5, nameEn: 'June', shortEn: 'Jun' },
  { index: 6, nameEn: 'July', shortEn: 'Jul' },
  { index: 7, nameEn: 'August', shortEn: 'Aug' },
  { index: 8, nameEn: 'September', shortEn: 'Sep' },
  { index: 9, nameEn: 'October', shortEn: 'Oct' },
  { index: 10, nameEn: 'November', shortEn: 'Nov' },
  { index: 11, nameEn: 'December', shortEn: 'Dec' },
];

export const WEEKDAYS: Weekday[] = [
  { index: 0, nameEn: 'Sunday', nameNp: 'आइतवार', translitNp: 'Aaitabar', shortEn: 'Sun', shortNp: 'आइत' },
  { index: 1, nameEn: 'Monday', nameNp: 'सोमवार', translitNp: 'Sombar', shortEn: 'Mon', shortNp: 'सोम' },
  { index: 2, nameEn: 'Tuesday', nameNp: 'मङ्गलवार', translitNp: 'Mangalbar', shortEn: 'Tue', shortNp: 'मङ्गल' },
  { index: 3, nameEn: 'Wednesday', nameNp: 'बुधवार', translitNp: 'Budhabar', shortEn: 'Wed', shortNp: 'बुध' },
  { index: 4, nameEn: 'Thursday', nameNp: 'बिहीवार', translitNp: 'Bihibar', shortEn: 'Thu', shortNp: 'बिही' },
  { index: 5, nameEn: 'Friday', nameNp: 'शुक्रवार', translitNp: 'Shukrabar', shortEn: 'Fri', shortNp: 'शुक्र' },
  { index: 6, nameEn: 'Saturday', nameNp: 'शनिवार', translitNp: 'Sanibar', shortEn: 'Sat', shortNp: 'शनि' },
];

export const MIN_BS_YEAR = 2000;
export const MAX_BS_YEAR = 2090;
export const MIN_AD_YEAR = 1944;
export const MAX_AD_YEAR = 2033;

/**
 * Converts English digits to Devanagari numerals.
 * Example: 2083 -> २०८३
 */
export function toDevanagariNumerals(val: number | string): string {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(val).replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
}

/**
 * Computes current date & time anchored specifically to Nepal Time (Asia/Kathmandu: UTC+05:45).
 * Guarantees that whether a user visits from New York, London, or Tokyo, today's date
 * reflects the exact official day in Nepal.
 */
export function getNepalCurrentDate(): Date {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = 12;
    let minute = 0;
    let second = 0;

    for (const part of parts) {
      if (part.type === 'year') year = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
      if (part.type === 'second') second = parseInt(part.value, 10);
    }
    return new Date(year, month - 1, day, hour, minute, second);
  } catch {
    // Fallback: UTC + 5h45m
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const nepalOffset = (5 * 60 + 45) * 60000;
    return new Date(utcTime + nepalOffset);
  }
}

/**
 * Month keys in dateConfigMap for looking up days in month
 */
const CONFIG_MONTH_KEYS = [
  'Baisakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Aswin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

/**
 * Returns number of days in a given BS month of a given BS year.
 * @param year BS year (e.g. 2083)
 * @param monthIndex 0-indexed month (0 = Baishakh, 11 = Chaitra)
 */
export function getDaysInBsMonth(year: number, monthIndex: number): number {
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    return 30;
  }
  const yearData = dateConfigMap[String(year)];
  if (!yearData) return 30;
  const key = CONFIG_MONTH_KEYS[monthIndex];
  return (key && yearData[key]) || 30;
}

/**
 * Returns number of days in a given Gregorian AD month of a given year.
 * @param year AD year (e.g. 2026)
 * @param monthIndex 0-indexed month (0 = January, 11 = December)
 */
export function getDaysInAdMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export interface ConvertedBsDate {
  bsYear: number;
  bsMonth: number; // 0-indexed
  bsMonthHuman: number; // 1-indexed (1..12)
  bsDay: number;
  monthEn: string;
  monthNp: string;
  dayOfWeek: number; // 0=Sunday..6=Saturday
  weekdayEn: string;
  weekdayNp: string;
  weekdayTranslitNp: string;
  formattedEn: string; // e.g. "2083 Ashwin 22, Thursday"
  formattedNp: string; // e.g. "२०८३ आश्विन २२, बिहीवार"
  dateString: string; // "2083-06-22"
  adEquivalentDate: Date;
  adFormattedEn: string; // "October 8, 2026"
  adWeekdayEn: string; // "Thursday"
}

export interface ConvertedAdDate {
  adYear: number;
  adMonth: number; // 0-indexed
  adMonthHuman: number; // 1-indexed (1..12)
  adDay: number;
  monthEn: string;
  dayOfWeek: number; // 0=Sunday..6=Saturday
  weekdayEn: string;
  weekdayNp: string;
  formattedEn: string; // e.g. "October 8, 2026, Thursday"
  dateString: string; // "2026-10-08"
  bsEquivalent: ConvertedBsDate;
}

/**
 * Converts AD Gregorian Date into Bikram Sambat (BS).
 */
export function convertAdToBs(year: number, monthIndex: number, day: number): ConvertedBsDate {
  // Construct date at midday to avoid boundary offset issues
  const jsDate = new Date(year, monthIndex, day, 12, 0, 0);
  const nd = new NepaliDate(jsDate);

  const bsYear = nd.getYear();
  const bsMonth = nd.getMonth(); // 0-indexed in nepali-date-converter
  const bsDay = nd.getDate();
  const dayOfWeek = nd.getDay(); // 0..6

  const monthMeta = NEPALI_MONTHS[bsMonth] || NEPALI_MONTHS[0];
  const weekdayMeta = WEEKDAYS[dayOfWeek] || WEEKDAYS[0];

  const adMonthMeta = GREGORIAN_MONTHS[monthIndex] || GREGORIAN_MONTHS[0];
  const adFormattedEn = `${adMonthMeta.nameEn} ${day}, ${year}`;

  const formattedEn = `${bsYear} ${monthMeta.nameEn} ${bsDay}, ${weekdayMeta.nameEn}`;
  const formattedNp = `${toDevanagariNumerals(bsYear)} ${monthMeta.nameNp} ${toDevanagariNumerals(bsDay)}, ${weekdayMeta.nameNp}`;
  const padMonth = String(bsMonth + 1).padStart(2, '0');
  const padDay = String(bsDay).padStart(2, '0');
  const dateString = `${bsYear}-${padMonth}-${padDay}`;

  return {
    bsYear,
    bsMonth,
    bsMonthHuman: bsMonth + 1,
    bsDay,
    monthEn: monthMeta.nameEn,
    monthNp: monthMeta.nameNp,
    dayOfWeek,
    weekdayEn: weekdayMeta.nameEn,
    weekdayNp: weekdayMeta.nameNp,
    weekdayTranslitNp: weekdayMeta.translitNp,
    formattedEn,
    formattedNp,
    dateString,
    adEquivalentDate: jsDate,
    adFormattedEn,
    adWeekdayEn: weekdayMeta.nameEn,
  };
}

/**
 * Converts Bikram Sambat (BS) date into Gregorian (AD).
 */
export function convertBsToAd(bsYear: number, bsMonthIndex: number, bsDay: number): ConvertedAdDate {
  // Clamp day to max allowed in this month
  const maxDays = getDaysInBsMonth(bsYear, bsMonthIndex);
  const validDay = Math.min(Math.max(1, bsDay), maxDays);

  const nd = new NepaliDate(bsYear, bsMonthIndex, validDay);
  const jsDate = nd.toJsDate();

  const adYear = jsDate.getFullYear();
  const adMonth = jsDate.getMonth();
  const adDay = jsDate.getDate();
  const dayOfWeek = jsDate.getDay();

  const adMonthMeta = GREGORIAN_MONTHS[adMonth] || GREGORIAN_MONTHS[0];
  const weekdayMeta = WEEKDAYS[dayOfWeek] || WEEKDAYS[0];

  const formattedEn = `${adMonthMeta.nameEn} ${adDay}, ${adYear}, ${weekdayMeta.nameEn}`;
  const padMonth = String(adMonth + 1).padStart(2, '0');
  const padDay = String(adDay).padStart(2, '0');
  const dateString = `${adYear}-${padMonth}-${padDay}`;

  const bsEquiv = convertAdToBs(adYear, adMonth, adDay);

  return {
    adYear,
    adMonth,
    adMonthHuman: adMonth + 1,
    adDay,
    monthEn: adMonthMeta.nameEn,
    dayOfWeek,
    weekdayEn: weekdayMeta.nameEn,
    weekdayNp: weekdayMeta.nameNp,
    formattedEn,
    dateString,
    bsEquivalent: bsEquiv,
  };
}

/**
 * Returns dynamic live "Today" information in Nepal Timezone.
 */
export function getLiveTodayNepal() {
  const nepalNow = getNepalCurrentDate();
  const adYear = nepalNow.getFullYear();
  const adMonth = nepalNow.getMonth();
  const adDay = nepalNow.getDate();

  const bsInfo = convertAdToBs(adYear, adMonth, adDay);
  const adMonthMeta = GREGORIAN_MONTHS[adMonth];
  const weekdayMeta = WEEKDAYS[nepalNow.getDay()];

  return {
    nepalDate: nepalNow,
    ad: {
      year: adYear,
      month: adMonth,
      day: adDay,
      monthName: adMonthMeta.nameEn,
      weekdayName: weekdayMeta.nameEn,
      formatted: `${adMonthMeta.nameEn} ${adDay}, ${adYear}`,
    },
    bs: {
      year: bsInfo.bsYear,
      month: bsInfo.bsMonth,
      day: bsInfo.bsDay,
      monthNameEn: bsInfo.monthEn,
      monthNameNp: bsInfo.monthNp,
      weekdayNameEn: bsInfo.weekdayEn,
      weekdayNameNp: bsInfo.weekdayNp,
      formattedEn: `${bsInfo.bsYear} ${bsInfo.monthEn} ${bsInfo.bsDay}`,
      formattedNp: `${toDevanagariNumerals(bsInfo.bsYear)} ${bsInfo.monthNp} ${toDevanagariNumerals(bsInfo.bsDay)}`,
      formattedFullEn: bsInfo.formattedEn,
      formattedFullNp: bsInfo.formattedNp,
    },
  };
}
