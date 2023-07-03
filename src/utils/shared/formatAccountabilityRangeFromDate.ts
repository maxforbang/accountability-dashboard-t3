import {
  isMonday,
  previousMonday,
  isSunday,
  nextSunday,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
};

export function formatAccountabilityRangeFromDate(
  selectedDate: Date,
  type: string
) {
  let startDate;
  let endDate;

  if (type === "WEEK") {
    startDate = isMonday(selectedDate)
      ? selectedDate
      : previousMonday(selectedDate);

    endDate = isSunday(selectedDate) ? selectedDate : nextSunday(selectedDate);
  } else if (type === "QUARTER") {
    startDate = startOfQuarter(selectedDate)

    endDate = endOfQuarter(selectedDate)
  } else {
    return selectedDate.getFullYear();
  }

  return `${startDate?.toLocaleDateString(
    undefined,
    dateFormatOptions
  )} - ${endDate?.toLocaleDateString(undefined, dateFormatOptions)}`;
}
