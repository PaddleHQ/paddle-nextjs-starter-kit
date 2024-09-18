import { DashboardUsageCardGroup } from '@/components/dashboard/landing/components/dashboard-usage-card-group';
import { DashboardSubscriptionCardGroup } from '@/components/dashboard/landing/components/dashboard-subscription-card-group';
import { DashboardTutorialCard } from '@/components/dashboard/landing/components/dashboard-tutorial-card';
import { DashboardTeamMembersCard } from '@/components/dashboard/landing/components/dashboard-team-members-card';

export function DashboardLandingPage() {
  return (
    <div className={'grid flex-1 items-start gap-6 p-0 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}>
      <div className={'grid auto-rows-max items-start gap-6 lg:col-span-2'}>
        <DashboardUsageCardGroup />
        <DashboardSubscriptionCardGroup />
      </div>
      <div className={'grid auto-rows-max items-start gap-6'}>
        <DashboardTeamMembersCard />
        <DashboardTutorialCard />
      </div>
    </div>
  );
}
