import { Goal } from "@prisma/client";

export function calculateCompletionPercentage(goals: Goal[] = []): number {
  if (!goals.length) {
    return 0
  }
  let totalWeight = 0;
  let completedWeight = 0;
  for (const goal of goals) {
    const goalWeight = goal.weight !== null ? parseFloat(goal.weight.toString()) : 1
    totalWeight += goalWeight
    
    if (goal.completed) {
      completedWeight += goalWeight
    }
  }
  return completedWeight / totalWeight * 100
}