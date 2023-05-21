import { Goal } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import { classNames } from "~/utils/shared/functions";

export default function EditGoalInput({ goal }: { goal: Goal }) {
  const ctx = api.useContext();

  const { mutate: updateGoal } = api.goals.updateGoal.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const { mutate: deleteGoal } = api.goals.deleteGoal.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const [goalValue, setGoalValue] = useState(goal.content);
  const [descriptionValue, setDescriptionValue] = useState(goal.description);

  const goalModified =
    goal.content != goalValue || goal.description != descriptionValue;

  return (
    <div className="isolate my-6 -space-y-px rounded-md bg-white shadow-sm">
      <div className="relative">
        <div className="flex ">
          <div
            className={classNames(
              "flex-1 rounded-md rounded-b-none rounded-tr-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-50 focus-within:ring-2 focus-within:ring-blue-600"
            )}
          >
            <label
              htmlFor={`goal-${goal.id}`}
              className="block text-xs font-medium text-gray-900"
            >
              Goal
            </label>
            <input
              type="text"
              name="goal"
              id={`goal-${goal.id}`}
              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Enter goal..."
              value={goalValue}
              onChange={(e) => {
                setGoalValue(e.target.value);
              }}
            />
          </div>
          {goalModified ? (
            <div className="flex flex-col justify-center rounded-tr-md bg-green-200 ring-1 ring-inset ring-green-500 hover:bg-green-300">
              <button
                className="h-full w-full px-5"
                onClick={() =>
                  updateGoal({
                    goalId: goal.id,
                    content: goalValue,
                    description: descriptionValue,
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center rounded-tr-md bg-red-100 ring-1 ring-inset ring-red-300 hover:bg-red-300">
              <button
                className="h-full w-full px-5"
                onClick={() => deleteGoal({ goalId: goal.id })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={classNames(
          "relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-blue-600"
        )}
      >
        <label
          htmlFor={`description-${goal.id}`}
          className="block text-xs font-medium text-gray-900"
        >
          Description
        </label>
        <input
          type="text"
          name="goal-description"
          id={`description-${goal.id}`}
          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="(Optional)"
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.target.value)}
        />
      </div>
    </div>
  );
}