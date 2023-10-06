import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '@/app/_trpc/client';

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get('origin');

  const { data } = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // User is synced to db
        router.push(origin ? `/${origin}` : '/dashboard');
      }
    }
  });

  return <div>AuthCallbackPage</div>;
};

export default AuthCallbackPage;
