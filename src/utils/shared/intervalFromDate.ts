import {
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  subMinutes,
  addDays,
  subDays,
  addMilliseconds,
  subMilliseconds,
} from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";

export function intervalFromDate(
  utcDate: Date,
  type: "WEEK" | "QUARTER" | "YEAR"
): { startDate: Date; endDate: Date } {
  const accountabilityStartDay = 1; // Monday

  let startDate, endDate;
  const localDate = subMinutes(utcDate, utcDate.getTimezoneOffset());
  const targetPeriod = localDate;

  switch (type) {
    case "WEEK":
      startDate = startOfWeek(targetPeriod); // startOfWeek returns Sunday of server's local time (UTC on Vercel)
      endDate = endOfWeek(targetPeriod);
      break;
    case "QUARTER":
      startDate = startOfQuarter(targetPeriod);
      endDate = endOfQuarter(targetPeriod);
      break;
    case "YEAR":
      startDate = startOfYear(targetPeriod);
      endDate = endOfYear(targetPeriod);
      break;
  }

  const timezoneOffset = getTimezoneOffset("America/New_York");
  startDate = addDays(startDate, accountabilityStartDay);
  endDate = addDays(endDate, accountabilityStartDay);

  return {
    startDate: subMilliseconds(startDate, timezoneOffset),
    endDate: subMilliseconds(endDate, timezoneOffset),
  };
}
