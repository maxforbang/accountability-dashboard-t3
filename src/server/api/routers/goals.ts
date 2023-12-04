import { clerkClient } from "@clerk/nextjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { isMonday, isSunday, nextSunday, previousMonday } from "date-fns";
import { log } from "next-axiom";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { intervalFromDate } from "~/utils/shared/intervalFromDate";

export const goalsRouter = createTRPCRouter({
  getTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const memberships = await ctx.prisma.membership.findMany({
        where: {
          teamId: input.teamId,
        },
        orderBy: {
          pigEars: "desc",
        },
      });

      const users = await clerkClient.users.getUserList({
        userId: memberships.map((member) => member.userId),
      });

      return { memberships, users };
    }),
  getTeammates: publicProcedure
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

      const users = await clerkClient.users.getUserList({
        userId: memberships.map((member) => member.userId),
      });

      return { memberships, users };
    }),
  getUserGoalsForCurrentAccountabilityPeriod: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        selectedDate: z.date(),
        type: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const accountabilityPeriod = await getAccountabilityPeriod(
        ctx.prisma,
        input.teamId,
        input.selectedDate,
        input.type
      );

      if (accountabilityPeriod) {
        const goals = await ctx.prisma.goal.findMany({
          where: {
            accountabilityPeriodId: accountabilityPeriod.id,
            userId: input.userId,
          },
        });

        return { goals };
      } else {
        return { goals: [] };
      }
    }),
  toggleCompleted: publicProcedure
    .input(
      z.object({
        goalId: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.update({
        where: {
          id: input.goalId,
        },
        data: {
          completed: input.completed,
        },
      });
    }),
  createGoal: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        selectedDate: z.date(),
        content: z.string(),
        description: z.string(),
        teamId: z.string(),
        type: z.enum(["WEEK", "QUARTER", "YEAR"]),
        weight: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let accountabilityPeriod = await getAccountabilityPeriod(
        ctx.prisma,
        input.teamId,
        input.selectedDate,
        input.type
      );

      if (!accountabilityPeriod) {
        const { startDate, endDate } = intervalFromDate(
          input.selectedDate,
          input.type
        );

        try {
          accountabilityPeriod = await ctx.prisma.accountabilityPeriod.create({
            data: {
              startDay: startDate,
              endDay: endDate,
              type: input.type,
              teamId: input.teamId,
            },
          });

          log.warn("Accountability Period created", {
            serverTime: new Date(),
            passedInDate: input.selectedDate,
            accountabilityPeriodDates: `${startDate} - ${endDate}`,
          });
        } catch (error) {
          console.error(error);
          throw new Error(
            `Failed to create a new accountability period. Error: ${
              error as string
            }`
          );
        }
      }

      return (
        accountabilityPeriod &&
        (await ctx.prisma.goal.create({
          data: {
            userId: input.userId,
            accountabilityPeriodId: accountabilityPeriod?.id,
            content: input.content,
            description: input.description,
            completed: false,
            weight: parseFloat(input.weight || "1"),
          },
        }))
      );
    }),
  updateGoal: publicProcedure
    .input(
      z.object({
        goalId: z.string(),
        content: z.string(),
        description: z.string(),
        weight: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.update({
        where: {
          id: input.goalId,
        },
        data: {
          content: input.content,
          description: input.description,
          weight: parseFloat(input.weight || "1"),
        },
      });
    }),
  deleteGoal: publicProcedure
    .input(
      z.object({
        goalId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.delete({
        where: {
          id: input.goalId,
        },
      });
    }),
  markAllComplete: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        selectedDate: z.date(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const accountabilityPeriod = await getAccountabilityPeriod(
        ctx.prisma,
        input.teamId,
        input.selectedDate,
        input.type
      );

      return (
        accountabilityPeriod &&
        (await ctx.prisma.goal.updateMany({
          where: {
            userId: input.userId,
            accountabilityPeriodId: accountabilityPeriod.id,
          },
          data: {
            completed: true,
          },
        }))
      );
    }),
  deleteAll: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        selectedDate: z.date(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const accountabilityPeriod = await getAccountabilityPeriod(
        ctx.prisma,
        input.teamId,
        input.selectedDate,
        input.type
      );

      return (
        accountabilityPeriod &&
        (await ctx.prisma.goal.deleteMany({
          where: {
            userId: input.userId,
            accountabilityPeriodId: accountabilityPeriod.id,
          },
        }))
      );
    }),
});

async function getAccountabilityPeriod(
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  teamId: string,
  date: Date,
  type: string
) {
  return await prisma.accountabilityPeriod.findFirst({
    where: {
      teamId: teamId,
      startDay: {
        lte: date,
      },
      endDay: {
        gt: date,
      },
      type: type,
    },
  });
}
