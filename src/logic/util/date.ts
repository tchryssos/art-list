import { format, parseISO } from 'date-fns';

export const formatDate = (date: string, dateFormat = 'MM/dd/yy') =>
  format(parseISO(date), dateFormat);
