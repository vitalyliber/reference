import SSF from 'ssf';

export const tableDateFormat = val =>
  `${SSF.format('DD', val)}.${SSF.format('mm', val)}.${SSF.format('yyyy', val)}`;
