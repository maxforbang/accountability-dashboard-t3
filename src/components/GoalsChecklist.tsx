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
import { AccountabilityPeriod, Goal } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { api } from "~/utils/api";
import { timeSinceModifiedString } from "~/utils/shared/functions";
dayjs.extend(relativeTime);

interface GoalsCheckListProps {
  goals: Goal[];
  teamId;
  userId;
  date;
  type;
}

const GoalsChecklist = ({
  goals,
  teamId,
  userId,
  date,
  type,
}: GoalsCheckListProps) => {
  const ctx = api.useContext();

  const { mutate: toggleCompleted } = api.goals.toggleCompleted.useMutation({
    onSuccess: () => {
      void ctx.goals.getUserGoalsForCurrentAccountabilityPeriod.invalidate();
    },
  });

  const addMutation = api.msg.add.useMutation({
    onMutate: async (newMessage) => {
      await utils.msg.list.cancel();
      const previousMessages = utils.msg.list.getData();
      // Define a new temp message because it doesnt have all the fields
      const tempMessage: Message = {
        ...newMessage,
        id: Math.random().toString(),
        imageUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        imageKey: null, // change undefined to null because ts complained
      };
      utils.msg.list.setData(
        {
          take: 5, // please explain what this does.
        },
        (old) => {
          if (!old) return;
          const newMessages = [...old.messages, tempMessage];
          return {
            messages: newMessages,
            nextCursor: old.nextCursor,
          };
        }
      );

      return { previousMessages };
    },

    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        utils.msg.list.setData(
          {
            take: 5,
          },
          context.previousMessages
        );
      }
    },

    onSuccess: async () => {
      await utils.msg.list.invalidate();
    },
  });

  const rows = goals.map((goal) => {
    return (
      <div className="relative flex items-center pb-4 pt-3.5">
        <div className="min-w-0 flex-1 text-sm leading-6">
          <label htmlFor="comments" className="font-medium text-gray-900">
            {goal.content}
          </label>
          <p id="comments-description" className="text-gray-500">
            {goal.description}
          </p>
        </div>
        <div className="ml-3 flex h-6 items-center">
          <input
            id="comments"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-indigo-600"
            checked={goal.completed}
            onChange={() =>
              toggleCompleted({
                goalId: goal.id,
                completed: !goal.completed,
              })
            }
          />
        </div>
      </div>
    );
  });

  const latestUpdatedGoal = goals.reduce((previousGoal, currentGoal) => {
    return currentGoal.updatedAt > previousGoal.updatedAt
      ? currentGoal
      : previousGoal;
  }, goals.at(0));

  return (
    <>
      <fieldset className="border-b border-t border-gray-200">
        <legend className="sr-only">Notifications</legend>
        <div className="divide-y divide-gray-200">{rows}</div>
      </fieldset>
      <div className="mt-5 flex justify-end text-sm">
        <p className="text-gray-400">{timeSinceModifiedString(latestUpdatedGoal)}</p>
      </div>
    </>
  );
};

export default GoalsChecklist;
