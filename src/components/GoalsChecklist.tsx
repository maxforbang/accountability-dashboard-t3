/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import type { Goal } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import { calculateGoalPercentage } from "~/utils/shared/calculateCompletionPercentage";
import { classNames, timeSinceModifiedString } from "~/utils/shared/functions";
dayjs.extend(relativeTime);

interface GoalsCheckListProps {
  goals: Goal[];
  editable?: boolean;
  type: "WEEK" | "QUARTER" | "YEAR";
}

const GoalsChecklist = ({
  goals,
  editable = true,
  type,
}: GoalsCheckListProps) => {
  const ctx = api.useContext();

  const { mutate: toggleCompleted } = api.goals.toggleCompleted.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const rows = goals.map((goal) => {
    return (
      <div
        className={classNames(
          "relative flex items-center pb-4 pt-3.5 text-gray-500"
        )}
        key={`goal-${goal.id}`}
      >
        <div className="min-w-0 flex-1 leading-6 sm:leading-7">
          <label
            htmlFor="comments"
            className={classNames(
              "text-md font-medium sm:text-lg text-gray-900"
            )}
          >
            {goal.content}
          </label>
          <p id="comments-description" className="text-md sm:text-md ">
            {goal.description}
          </p>
        </div>
        {type === "QUARTER" && (
          <p className={classNames("ml-5", goal.completed ? 'font-bold text-green-700 border-2 border-green-700 px-2 rounded-lg' : '')}>{`${Math.round(
            calculateGoalPercentage(goal, goals)
          )}%`}</p>
        )}
        {editable && (
          <div className="ml-5 flex h-6 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-green-700 focus:ring-sky-600"
              checked={goal.completed}
              onChange={() =>
                toggleCompleted({
                  goalId: goal.id,
                  completed: !goal.completed,
                })
              }
            />
          </div>
        )}
      </div>
    );
  });

  const latestUpdatedGoal = goals.reduce((previousGoal, currentGoal) => {
    return currentGoal.updatedAt > (previousGoal ? previousGoal.updatedAt : 0)
      ? currentGoal
      : previousGoal;
  }, goals.at(0));

  return (
    <>
      <fieldset className="border-b  border-gray-200">
        <legend className="sr-only">Notifications</legend>
        <div className="divide-y divide-gray-200 sm:mt-1">{rows}</div>
      </fieldset>
      <div className="mt-5 flex justify-end text-sm">
        <p className="text-gray-400">
          {timeSinceModifiedString(latestUpdatedGoal)}
        </p>
      </div>
    </>
  );
};

export default GoalsChecklist;
