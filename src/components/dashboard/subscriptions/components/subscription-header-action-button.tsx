'use client';

import { cancelSubscription } from '@/app/dashboard/subscriptions/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { Confirmation } from '@/components/shared/confirmation/confirmation';

interface Props {
  subscriptionId: string;
}

export function SubscriptionHeaderActionButton({ subscriptionId }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  function handleCancelSubscription() {
    setModalOpen(false);
    setLoading(true);
    cancelSubscription(subscriptionId)
      .then(() => {
        toast({
          description: (
            <div className={'flex items-center gap-3'}>
              <CircleCheck size={20} color={'#25F497'} />
              <div className={'flex flex-col gap-1'}>
                <span className={'text-primary font-medium test-sm leading-5'}>Cancellation scheduled</span>
                <span className={'text-muted-foreground test-sm leading-5'}>
                  Subscription scheduled to cancel at the end of the billing period.
                </span>
              </div>
            </div>
          ),
        });
      })
      .catch((error) => {
        toast({
          description: (
            <div className={'flex items-start gap-3'}>
              <CircleAlert size={20} color={'#F42566'} />
              <div className={'flex flex-col gap-1'}>
                <div className={'text-primary font-medium test-sm leading-5'}>Error</div>
                <div className={'text-muted-foreground test-sm leading-5'}>
                  Something went wrong, please try again later
                </div>
              </div>
            </div>
          ),
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Button
        disabled={loading}
        onClick={() => setModalOpen(true)}
        size={'sm'}
        variant={'outline'}
        className={'flex gap-2 text-sm rounded-sm border-border'}
      >
        Cancel subscription
      </Button>
      <Confirmation
        description={'This subscription will be scheduled to cancel at the end of the billing period.'}
        title={'Cancel subscription?'}
        onClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
        onConfirm={handleCancelSubscription}
      />
    </>
  );
}
