import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.goal.findMany();
  }),
});
