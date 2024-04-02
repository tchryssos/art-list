import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formatDate = (date: string | Date, dateFormat = 'MM/dd/yy') => {
  let parsed = date;
  if (typeof date === 'string') {
    parsed = parseISO(date);
  }
  // Because we only record dd mm yyyy our dates are saved as
  // midnight UTC on that date. If we don't force a UTC timezone
  // we can end up with incorrect day info when in timezones behind UTC
  const tzAjusted = utcToZonedTime(parsed, 'UTC');
  return format(tzAjusted, dateFormat);
};
