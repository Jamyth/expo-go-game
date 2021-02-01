function format(date: Date = new Date()) {
  return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`;
}

export const DateUtil = Object.freeze({
  format,
});
