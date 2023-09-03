import {
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  subMinutes,
  addDays,
  subDays
} from "date-fns";

export function intervalFromDate(
  utcDate: Date,
  type: "WEEK" | "QUARTER" | "YEAR"
): { startDate: Date; endDate: Date } {

  const accountabilityStartDay = 1 // Monday
  
  let startDate, endDate;
  const localDate = subMinutes(utcDate, utcDate.getTimezoneOffset())
  const targetPeriod = subDays(localDate, accountabilityStartDay)

  switch (type) {
    case "WEEK":
      startDate = startOfWeek(targetPeriod); // startOfWeek returns Sunday of local time
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
  
  return {
    startDate: addDays(startDate, accountabilityStartDay),
    endDate: addDays(endDate, accountabilityStartDay),
  };
}
