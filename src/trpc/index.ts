import { TRPCError } from '@trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { db } from '@/db';
import { publicProcedure, router } from '@/trpc/trpc';

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
  })
});

export type AppRouter = typeof appRouter;
