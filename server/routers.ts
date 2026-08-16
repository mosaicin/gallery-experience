import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const recentContactSubmissions = new Map<string, number>();
const CONTACT_COOLDOWN_MS = 60_000;

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().trim().max(120).optional().default(""),
        email: z.string().trim().email().max(320).optional().or(z.literal("")),
        brief: z.string().trim().min(10).max(4000),
        website: z.string().max(120).optional().default(""),
      }))
      .mutation(async ({ input, ctx }) => {
        if (input.website) return { success: true as const };
        const key = ctx.req.ip || ctx.req.headers["x-forwarded-for"]?.toString() || "unknown";
        const now = Date.now();
        const last = recentContactSubmissions.get(key) ?? 0;
        if (now - last < CONTACT_COOLDOWN_MS) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Попробуйте отправить заявку немного позже." });
        }
        recentContactSubmissions.set(key, now);
        const contact = input.email ? `Почта: ${input.email}` : "Почта: не указана";
        const name = input.name ? `Имя: ${input.name}` : "Имя: не указано";
        const sent = await notifyOwner({
          title: "Новая заявка на мозаичное панно",
          content: `${name}\n${contact}\n\nОписание проекта:\n${input.brief}`,
        });
        if (!sent) {
          recentContactSubmissions.delete(key);
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Сервис уведомлений временно недоступен." });
        }
        return { success: true as const };
      }),
  }),

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
