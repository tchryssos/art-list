import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formatDate = (date: string, dateFormat = 'MM/dd/yy') => {
  const parsed = parseISO(date);
  // Because we only record dd mm yyyy our dates are saved as
  // midnight UTC on that date. If we don't force a UTC timezone
  // we can end up with incorrect day info when in timezones behind UTC
  const tzAjusted = utcToZonedTime(parsed, 'UTC');
  return format(tzAjusted, dateFormat);
};
