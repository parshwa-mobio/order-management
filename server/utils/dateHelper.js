export const dateHelper = {
  getStartDate(days) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    return startDate;
  },

  getStartDateByMonths(months) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    return startDate;
  },

  formatPeriod(year, month) {
    return `${year}-${month.toString().padStart(2, "0")}`;
  },
};
