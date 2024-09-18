import { Separator } from '@/components/ui/separator';
import { MobileSidebar } from '@/components/dashboard/layout/mobile-sidebar';

interface Props {
  pageTitle: string;
}

export function DashboardPageHeader({ pageTitle }: Props) {
  return (
    <div>
      <div className={'flex items-center gap-6'}>
        <MobileSidebar />
        <h1 className="text-lg font-semibold md:text-4xl">{pageTitle}</h1>
      </div>
      <Separator className={'relative bg-border my-8 dashboard-header-highlight'} />
    </div>
  );
}
