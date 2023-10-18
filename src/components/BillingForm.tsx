'use client';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import Footer from '@/components/Footer';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();

  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          toast({
            title: 'There was a problem',
            description: 'Please try again later.',
            variant: 'destructive'
          });
        }
      }
    });

  return (
    <>
      <MaxWidthWrapper className='max-w-5xl min-h-[calc(100vh_-_10.1rem)]'>
        <form
          className='mt-12'
          onSubmit={(e) => {
            e.preventDefault();
            createStripeSession();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                You are currently on the{' '}
                <strong>{subscriptionPlan.name}</strong> plan.
              </CardDescription>
            </CardHeader>

            <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
              <Button type='submit'>
                {isLoading && <Loader2 className='mr-4 h-4 w-4 animate-spin' />}
                {subscriptionPlan.isSubscribed
                  ? 'Manage Subscription'
                  : 'Upgrade to PRO'}
              </Button>

              {subscriptionPlan.isSubscribed && (
                <p className='rounded-full text-xs font-medium'>
                  {subscriptionPlan.isCanceled
                    ? 'Your plan will be canceled on '
                    : 'Your plan renews on '}
                  {format(
                    subscriptionPlan.stripeCurrentPeriodEnd!,
                    'dd MMM yyyy'
                  )}
                  .
                </p>
              )}
            </CardFooter>
          </Card>
        </form>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default BillingForm;
