import { Subscription } from '@paddle/paddle-node-sdk';
import Image from 'next/image';
import { Status } from '@/components/shared/status/status';
import { parseMoney } from '@/utils/paddle/parse-money';
import dayjs from 'dayjs';
import { SubscriptionHeaderActionButton } from '@/components/dashboard/subscriptions/components/subscription-header-action-button';
import { Alert } from '@/components/ui/alert';
import { SubscriptionAlerts } from '@/components/dashboard/subscriptions/components/subscription-alerts';

interface Props {
  subscription: Subscription;
}

export function SubscriptionHeader({ subscription }: Props) {
  const subscriptionItem = subscription.items[0];

  const price = subscriptionItem.quantity * parseFloat(subscription?.recurringTransactionDetails?.totals.total ?? '0');
  const formattedPrice = parseMoney(price.toString(), subscription.currencyCode);
  const frequency =
    subscription.billingCycle.frequency === 1
      ? `/${subscription.billingCycle.interval}`
      : `every ${subscription.billingCycle.frequency} ${subscription.billingCycle.interval}s`;

  const formattedStartedDate = dayjs(subscription.startedAt).format('MMM DD, YYYY');

  return (
    <div className={'flex justify-between items-center'}>
      <div className={'flex flex-col w-full'}>
        <SubscriptionAlerts subscription={subscription} />
        <div className={'flex items-center gap-5'}>
          {subscriptionItem.product.imageUrl && (
            <Image src={subscriptionItem.product.imageUrl} alt={subscriptionItem.product.name} width={48} height={48} />
          )}
          <span className={'text-4xl leading-9 font-medium'}>{subscriptionItem.product.name}</span>
        </div>
        <div className={'flex items-center gap-8 py-8 pb-6'}>
          <div className={'flex gap-1 items-end'}>
            <span className={'text-4xl leading-9 font-medium'}>{formattedPrice}</span>
            <span className={'text-secondary text-sm leading-[14px] font-medium'}>{frequency}</span>
          </div>
          <div>
            <Status status={subscription.status} />
          </div>
        </div>
        <div className={'text-secondary text-base leading-5 pb-8'}>Started on: {formattedStartedDate}</div>
      </div>
      <div>
        {!(subscription.scheduledChange || subscription.status === 'canceled') && (
          <SubscriptionHeaderActionButton subscriptionId={subscription.id} />
        )}
      </div>
    </div>
  );
}
