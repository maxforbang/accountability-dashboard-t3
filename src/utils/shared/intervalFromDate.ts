import { startOfQuarter, endOfQuarter, startOfYear, endOfYear, startOfWeek, endOfWeek } from "date-fns";

export function intervalFromDate(
  date: Date,
  type: "WEEK" | "QUARTER" | "YEAR"
): { startDate: Date; endDate: Date } {
  switch (type) {
    case "WEEK":
      return { startDate: startOfWeek(date), endDate: endOfWeek(date) };
    case "QUARTER":
      return { startDate: startOfQuarter(date), endDate: endOfQuarter(date) };
    case "YEAR":
      return { startDate: startOfYear(date), endDate: endOfYear(date) };
    default:
      throw new Error("Invalid type specified.");
  }
}
