import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { db } from '@/db';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { IINFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { privateProcedure, publicProcedure, router } from '@/trpc/trpc';
import { PLANS } from '@/config/stripe';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Check if the user exist in db
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    });

    if (!dbUser) {
      // Create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    // Return user's files
    return await db.file.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? IINFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId
        }
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId
        },
        orderBy: {
          createdAt: 'desc'
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor
      };
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId
        }
      });

      if (!file) return { status: 'PENDING' as const };

      return { status: file.uploadStatus };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId
        }
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      return file;
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      // Find file belongs to user
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId
        }
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      // Delete file
      await db.file.delete({
        where: {
          id: input.id
        }
      });

      return file;
    }),

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl('/dashboard/billing');

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!dbUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === 'Pro')?.price.priceIds.test,
          quantity: 1
        }
      ],
      metadata: {
        userId: userId
      }
    });

    return { url: stripeSession.url };
  })
});

export type AppRouter = typeof appRouter;
