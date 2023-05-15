import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getTeamForUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const membership = await ctx.prisma.membership.findFirst({
        where: {
          userId: input.userId,
        },
      });

      return await ctx.prisma.team.findFirst({
        where: {
          id: membership?.teamId,
        },
      });
    }),
  getAllGoals: publicProcedure.query(({ ctx }) => {
    // return ctx.prisma.goal.findMany();
    // const users = await clerkClient.users.getUserList()
    // console.log(users)
    // return goals;
  }),
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return clerkClient.users.getUserList();
  }),
  getGoalsForCurrentAccountabilityPeriod: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        selectedDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentAccountabilityPeriod =
        await ctx.prisma.accountabilityPeriod.findFirst({
          where: {
            teamId: input.teamId,
            //startDay and endDay encompass selected date
          },
        });

      if (currentAccountabilityPeriod) {
        return await ctx.prisma.goal.findMany({
          where: {
            accountabilityPeriodId: currentAccountabilityPeriod.id,
          },
        });
      }

      return [];
    }),
});
