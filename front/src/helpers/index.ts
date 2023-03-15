import moment from "moment";
import "moment/locale/fr";

export default {
  formatDate(value: Date) {
    moment.locale("fr");
    return moment(value).format("D/MM/YYYY");
  },

  formatDateHour(value: Date) {
    moment.locale("fr");
    return moment(value).format("D/MM/YYYY, HH:mm");
  },

  formatDateReduce(value: Date) {
    moment.locale("fr");
    return moment(value).format("d MMMM YYYY");
  },

  truncate(value: string, max: number) {
    if (max < value.length) return value.slice(0, max) + "...";
    else return value;
  },

  currency(value: number) {
    return new Intl.NumberFormat().format(value);
  },
};
