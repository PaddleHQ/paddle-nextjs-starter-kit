import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { SubscriptionCards } from '@/components/dashboard/subscriptions/components/subscription-cards';
import { Subscription } from '@paddle/paddle-node-sdk';

interface Props {
  subscriptions: Subscription[];
}

export function MultipleSubscriptionsView({ subscriptions }: Props) {
  return (
    <>
      <DashboardPageHeader pageTitle={'Subscriptions'} />
      <SubscriptionCards className={'grid-cols-1 lg:grid-cols-3 gap-6'} subscriptions={subscriptions} />
    </>
  );
}
