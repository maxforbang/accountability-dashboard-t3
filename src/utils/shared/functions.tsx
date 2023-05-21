import { Goal } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}


export function timeSinceModifiedString(goal: Goal | undefined) {
  if (!goal) {
    return null;
  }

  const { createdAt, updatedAt } = goal;

  if (createdAt === updatedAt) {
    return "Created " + dayjs(createdAt).fromNow();
  }

  return "Updated " + dayjs(updatedAt).fromNow();
}