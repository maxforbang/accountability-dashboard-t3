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
import type { AccountabilityPeriod, Goal } from "@prisma/client";
import { useState } from "react";
import { timeSinceModifiedString } from "~/utils/shared/functions";
import EditGoalInput from "./EditGoalInput";
import CreateGoalInput from "./CreateGoalInput";

interface GoalsCheckListProps {
  goals: Goal[];
  accountabilityPeriod: AccountabilityPeriod;
}

const EditGoalsChecklist = ({ goals, accountabilityPeriod }: GoalsCheckListProps) => {
  const latestUpdatedGoal = goals.reduce((previousGoal, currentGoal) => {
    return currentGoal.updatedAt > (previousGoal ? previousGoal.updatedAt : 0)
      ? currentGoal
      : previousGoal;
  }, goals.at(0));

  const [createNewGoalMode, setCreateNewGoalMode] = useState(false);

  const goalRows = goals.map((goal) => {
    return <EditGoalInput goal={goal} key={`edit-goal-${goal.id}`}/>;
  });

  return (
    <div className="mt-4">
      <fieldset className="border-b border-gray-200">
        {createNewGoalMode ? <CreateGoalInput setCreateNewGoalMode={setCreateNewGoalMode} accountabilityPeriodId={accountabilityPeriod.id} /> : <NewGoalButton setCreateNewGoalMode={setCreateNewGoalMode} />}
        <div className="divide-y divide-gray-200">{goalRows}</div>
      </fieldset>
      <div className="mt-5 flex justify-end text-sm">
        <p className="text-gray-400">
          {timeSinceModifiedString(latestUpdatedGoal)}
        </p>
      </div>
    </div>
  );
};

export default EditGoalsChecklist;

const NewGoalButton = ({setCreateNewGoalMode}: {setCreateNewGoalMode: (value: boolean) => void}) => {
  return (
    <button
      type="button"
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => setCreateNewGoalMode(true)}
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <span className="mt-2 block text-sm font-semibold text-gray-900">
        Create new goal
      </span>
    </button>
  );
};

{
  /* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  
</svg> */
}
