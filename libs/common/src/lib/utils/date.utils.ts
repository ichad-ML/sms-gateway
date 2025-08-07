import dayjs = require('dayjs');
import { DateFormat } from '../enums/date.enum';

export function getCurrentDate(format = DateFormat.DMY): string {
  return dayjs().format(format);
}
