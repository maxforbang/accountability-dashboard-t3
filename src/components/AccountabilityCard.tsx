import { Component } from "react";
import { api } from "~/utils/api";
import GoalsChecklist from "./GoalsChecklist";

interface AccountabilityProps {
  teamId: string;
  userId: string;
  date: Date;
}

const AccountabilityCard = ({ teamId, userId, date }: AccountabilityProps) => {
  const { data: goals = [] } =
    api.goals.getUserGoalsForCurrentAccountabilityPeriod.useQuery({
      teamId,
      userId,
      selectedDate: date,
    });

  return (
    <>
      <h2 className="mb-8 text-3xl font-semibold leading-6 text-gray-900">
        Goals
      </h2>
      <GoalsChecklist goals={goals} />
    </>
  );
};

export default AccountabilityCard;
