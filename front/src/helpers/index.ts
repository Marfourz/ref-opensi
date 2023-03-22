import { DateTime } from "luxon";


export default {
  formatDate(value: string) {
   
    return DateTime.fromISO(value).setLocale("fr").toLocaleString() 
  },

  formatDateHour(value: string) {
   
    return DateTime.fromISO(value).setLocale("fr").toFormat("D, HH:mm");
  },

  formatDateReduce(value: string) {
  
    return DateTime.fromISO(value).setLocale("fr").toFormat("d MMMM yyyy");
  },

  truncate(value: string, max: number) {
    if (max < value.length) return value.slice(0, max) + "...";
    else return value;
  },

  currency(value: number) {
    return new Intl.NumberFormat().format(value);
  },
};
