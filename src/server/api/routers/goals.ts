import { clerkClient } from "@clerk/nextjs";
import { Description } from "@headlessui/react/dist/components/description/description";
import { AccountabilityType, Goal } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { describe } from "node:test";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
        pigEars: "desc"
      }
    });

    const users = await clerkClient.users.getUserList({
      userId: memberships.map(member => member.userId)
    })

    return {memberships, users};
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
        userId: memberships.map(member => member.userId)
      })

      return {memberships, users};
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
      const currentAccountabilityPeriod =
        await ctx.prisma.accountabilityPeriod.findFirst({
          where: {
            teamId: input.teamId,
            //startDay and endDay encompass selected date
            type: input.type,
          },
          orderBy: {
            startDay: "desc",
          },
        });

      if (currentAccountabilityPeriod) {
        const goals = await ctx.prisma.goal.findMany({
          where: {
            accountabilityPeriodId: currentAccountabilityPeriod.id,
            userId: input.userId,
          },
        });

        return { goals, accountabilityPeriod: currentAccountabilityPeriod };
      }

      return [];
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
        accountabilityPeriodId: z.string(),
        content: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.create({
        data: {
          userId: input.userId,
          accountabilityPeriodId: input.accountabilityPeriodId,
          content: input.content,
          description: input.description,
          completed: false
        },
      });
    }),
  updateGoal: publicProcedure
    .input(
      z.object({
        goalId: z.string(),
        content: z.string(),
        description: z.string(),
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
        userId: z.string(),
        accountabilityPeriodId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.updateMany({
        where: {
          userId: input.userId,
          accountabilityPeriodId: input.accountabilityPeriodId,
        },
        data: {
          completed: true
        }
      });
    }),
    deleteAll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        accountabilityPeriodId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.goal.deleteMany({
        where: {
          userId: input.userId,
          accountabilityPeriodId: input.accountabilityPeriodId,
        }
      });
    }),
});

// Archived Procedures
// ---------------------------------------------------------------------

// getAllGoalsForCurrentAccountabilityPeriod: publicProcedure
// .input(
//   z.object({
//     teamId: z.string(),
//     selectedDate: z.date(),
//   })
// )
// .query(async ({ ctx, input }) => {
//   const currentAccountabilityPeriod =
//     await ctx.prisma.accountabilityPeriod.findFirst({
//       where: {
//         teamId: input.teamId,
//         //startDay and endDay encompass selected date
//       },
//     });

//   if (currentAccountabilityPeriod) {
//     return await ctx.prisma.goal.findMany({
//       where: {
//         accountabilityPeriodId: currentAccountabilityPeriod.id,
//       },
//     });
//   }

//   return [];
// }),

// getTeamForUser: publicProcedure
// .input(
//   z.object({
//     userId: z.string(),
//   })
// )
// .query(async ({ ctx, input }) => {
//   const membership = await ctx.prisma.membership.findFirst({
//     where: {
//       userId: input.userId,
//     },
//   });

//   return await ctx.prisma.team.findFirst({
//     where: {
//       id: membership?.teamId,
//     },
//   });
// }),
