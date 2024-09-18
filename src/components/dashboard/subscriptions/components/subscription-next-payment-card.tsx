import { Card } from '@/components/ui/card';
import { Subscription, Transaction } from '@paddle/paddle-node-sdk';
import dayjs from 'dayjs';
import { parseMoney } from '@/utils/paddle/parse-money';
import { PaymentMethodSection } from '@/components/dashboard/subscriptions/components/payment-method-section';

interface Props {
  transactions?: Transaction[];
  subscription?: Subscription;
}

export function SubscriptionNextPaymentCard({ subscription, transactions }: Props) {
  if (!subscription?.nextBilledAt) {
    return null;
  }
  return (
    <Card className={'bg-background/50 backdrop-blur-[24px] border-border p-6 @container'}>
      <div className={'flex gap-6 flex-col border-border border-b pb-6'}>
        <div className={'text-xl font-medium'}>Next payment</div>
        <div className={'flex gap-1 items-end @16xs:flex-wrap'}>
          <span className={'text-xl leading-5 font-medium text-primary'}>
            {parseMoney(subscription?.nextTransaction?.details.totals.total, subscription?.currencyCode)}
          </span>
          <span className={'text-base text-secondary leading-4'}>due</span>
          <span className={'ext-base leading-4 font-semibold text-primary'}>
            {dayjs(subscription?.nextBilledAt).format('MMM DD, YYYY')}
          </span>
        </div>
      </div>
      <PaymentMethodSection
        transactions={transactions}
        updatePaymentMethodUrl={subscription?.managementUrls?.updatePaymentMethod}
      />
    </Card>
  );
}
