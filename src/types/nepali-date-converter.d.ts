declare module 'nepali-date-converter' {
  export interface DateConfigMap {
    [year: string]: {
      [month: string]: number;
    };
  }

  export const dateConfigMap: DateConfigMap;

  export default class NepaliDate {
    constructor(date?: Date | string | number);
    constructor(year: number, month: number, date: number);

    getYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    toJsDate(): Date;
    format(fmt: string): string;

    setDate(date: number): void;
    setMonth(month: number): void;
    setYear(year: number): void;

    static language: string;
    static fromAD(date: Date): NepaliDate;
    static parse(dateString: string): NepaliDate;
    static now(): NepaliDate;
  }
}
