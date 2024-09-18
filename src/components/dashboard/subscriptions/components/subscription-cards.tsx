import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Status } from '@/components/shared/status/status';
import { Subscription } from '@paddle/paddle-node-sdk';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { parseMoney } from '@/utils/paddle/parse-money';

interface Props {
  subscriptions: Subscription[];
  className: string;
}

export function SubscriptionCards({ subscriptions, className }: Props) {
  if (subscriptions.length === 0) {
    return <span className={'text-base font-medium'}>No active subscriptions</span>;
  } else {
    return (
      <div className={cn('grid flex-1 items-start', className)}>
        {subscriptions.map((subscription) => {
          const subscriptionItem = subscription.items[0];
          const price = subscriptionItem.quantity * parseFloat(subscriptionItem.price.unitPrice.amount);
          const formattedPrice = parseMoney(price.toString(), subscription.currencyCode);
          const frequency =
            subscription.billingCycle.frequency === 1
              ? `/${subscription.billingCycle.interval}`
              : `every ${subscription.billingCycle.frequency} ${subscription.billingCycle.interval}s`;
          return (
            <Card key={subscription.id} className={'bg-background/50 backdrop-blur-[24px] border-border p-6'}>
              <CardHeader className="p-0 space-y-0">
                <CardTitle className="flex flex-col justify-between items-start mb-6">
                  <div
                    className={cn('flex mb-4 w-full', {
                      'justify-between': subscriptionItem.product.imageUrl,
                      'justify-end': !subscriptionItem.product.imageUrl,
                    })}
                  >
                    {subscriptionItem.product.imageUrl && (
                      <Image
                        src={subscriptionItem.product.imageUrl}
                        alt={subscriptionItem.product.name}
                        width={48}
                        height={48}
                      />
                    )}
                    <Link href={`/dashboard/subscriptions/${subscription.id}`}>
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                  <span className={'text-xl leading-7 font-medium'}>{subscriptionItem.product.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className={'p-0 flex justify-between gap-3 flex-wrap xl:flex-nowrap'}>
                <div className={'flex flex-col gap-3'}>
                  <div className="text-base leading-6 text-secondary">{subscriptionItem.product.description}</div>
                  <div className="text-base leading-[16px] text-primary">
                    {formattedPrice}
                    {frequency}
                  </div>
                </div>
                <Status status={subscription.status} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}
