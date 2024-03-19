export function iso3166toBcp47Locale(iso=process.env.LC_ALL): string {
  if (!iso) return "";
  let [languageCode, regionCode] = iso.split(".")[0].split('_');
  // override docker/containerd's C locale
  if (languageCode.toUpperCase() == "C") {
    languageCode = "en";
    regionCode = "US";
  }
  return `${languageCode}-${regionCode}`;
}

export function getLocale(): string {
  return iso3166toBcp47Locale() // ISO 3166-1
      || process.env.LC_MESSAGES // ISO 3166-1
      || process.env.LANG // ISO 3166-1
      || process.env.LANGUAGE
      || navigator?.language // BCP 47
      || 'en-US';
}

const LOCALE: string = getLocale();

const localDateOptions: any = { day: '2-digit', month: '2-digit', year: '2-digit' };
const localHHMMOptions: any = { hour: '2-digit', minute: '2-digit' }; // hour12: true };
const localHHMMSSOptions: any = { hour: '2-digit', minute: '2-digit', second: '2-digit' }; // hour12: true;

// date only
export function dateToDateString(date: Date, locale=LOCALE): string {
  // return date.toISOString().slice(0, 10);
  return date.toLocaleDateString(locale, localDateOptions);
}

// time only
export function dateToTimeString(date: Date, locale=LOCALE) {
  return date.toLocaleTimeString(locale); // localTimeOptions
}

// date + time
export function dateToString(date: Date, locale=LOCALE) {
  return date.toLocaleString(locale);
}

// export function dateToHHMMSS(date: Date): string {
//   return date.toLocaleTimeString().replace(/:\d+ /, " ");
// }

export function dateToHHMM(date: Date, locale=LOCALE) {
  return date.toLocaleTimeString(locale, localHHMMOptions).replace(/\s/g, '');
}

export function dateToHHMMSS(date: Date, locale=LOCALE) {
  return date.toLocaleDateString(locale, localHHMMSSOptions).replace(/\s/g, '');
}

export function dateToDDMM(date: Date, locale='en-UK'): string {
  // return date.toISOString().slice(0, 10);
  return date.toLocaleDateString(locale).slice(0, 5);
}

export function dateToYYYYMMDD(date: Date, locale='en-UK'): string {
  // return date.toISOString().slice(0, 10).replace(/-/g, "");
  return date.toLocaleDateString(locale).split("/").reverse().join("-");
}

// export function isHoliday(date: Date): boolean {
//     return getYearHolidays(date.getFullYear())[date.getMonth()].includes(date.getDate());
// }

export function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}