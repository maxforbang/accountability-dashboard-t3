import { clerkClient } from "@clerk/nextjs";
import { Goal } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return clerkClient.users.getUserList();
  }),
  getAllGoalsForCurrentAccountabilityPeriod: publicProcedure
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
  getTeammatesMemberships: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {

      const memberships = await ctx.prisma.membership.findMany({
        where: {
          teamId: input.teamId,
          NOT: {
            userId: input.userId,
          },
        },
      });

      //const teammates = users.map(user => user.id !== input.userId)

      return memberships;
    }),
  getUserGoalsForCurrentAccountabilityPeriod: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
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
            userId: input.userId,
          },
        });
      }

      return [];
    }),
});
