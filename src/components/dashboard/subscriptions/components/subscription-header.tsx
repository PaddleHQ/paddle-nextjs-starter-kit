import { Subscription } from '@paddle/paddle-node-sdk';
import Image from 'next/image';
import { Status } from '@/components/shared/status/status';
import { parseMoney } from '@/utils/paddle/parse-money';
import dayjs from 'dayjs';
import { SubscriptionHeaderActionButton } from '@/components/dashboard/subscriptions/components/subscription-header-action-button';
import { SubscriptionAlerts } from '@/components/dashboard/subscriptions/components/subscription-alerts';
import { MobileSidebar } from '@/components/dashboard/layout/mobile-sidebar';

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
    <div className={'flex justify-between items-start sm:items-center flex-col sm:flex-row mb-6 sm:mb-0'}>
      <div className={'flex flex-col w-full'}>
        <SubscriptionAlerts subscription={subscription} />
        <div className={'flex items-center gap-5'}>
          <MobileSidebar />
          {subscriptionItem.product.imageUrl && (
            <Image src={subscriptionItem.product.imageUrl} alt={subscriptionItem.product.name} width={48} height={48} />
          )}
          <span className={'text-4xl leading-9 font-medium'}>{subscriptionItem.product.name}</span>
        </div>
        <div className={'flex items-center gap-6 py-8 pb-6 flex-wrap md:flex-wrap'}>
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
