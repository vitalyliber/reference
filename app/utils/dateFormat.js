import SSF from 'ssf';

export const tableDateFormat = val =>
  `${SSF.format('DD', val)}.${SSF.format('mm', val)}.${SSF.format(
    'yyyy',
    val
  )}`;

export const getListOfYears = (startYear, endYear) => {
  var currentYear = endYear || new Date().getFullYear() + 2,
    years = [];
  startYear = startYear || new Date().getFullYear() - 5;

  while (startYear <= currentYear) {
    years.push(startYear++);
  }

  return years;
};
