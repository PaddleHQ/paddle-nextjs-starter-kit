import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SubscriptionCards } from '@/components/dashboard/subscriptions/components/subscription-cards';
import { getSubscriptions } from '@/utils/paddle/get-subscriptions';
import { ErrorContent } from '@/components/dashboard/layout/error-content';

export async function DashboardSubscriptionCardGroup() {
  const subscriptions = await getSubscriptions();
  return (
    <Card className={'bg-background/50 backdrop-blur-[24px] border-border p-6'}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between items-center pb-6 border-border border-b">
          <span className={'text-xl font-medium'}>Active subscriptions</span>
          <Button asChild={true} size={'sm'} variant={'outline'} className={'text-sm rounded-sm border-border'}>
            <Link href={'/dashboard/subscriptions'}>View all</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={'p-0 pt-6 @container'}>
        {subscriptions?.data ? (
          <SubscriptionCards
            className={'grid-cols-1 gap-6 @[600px]:grid-cols-2'}
            subscriptions={subscriptions.data.slice(0, 2) ?? []}
          />
        ) : (
          <ErrorContent />
        )}
      </CardContent>
    </Card>
  );
}
