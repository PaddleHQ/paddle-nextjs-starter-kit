import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { ErrorContent } from '@/components/dashboard/layout/error-content';

export function SubscriptionErrorView() {
  return (
    <>
      <DashboardPageHeader pageTitle={'Subscriptions'} />
      <ErrorContent />
    </>
  );
}
