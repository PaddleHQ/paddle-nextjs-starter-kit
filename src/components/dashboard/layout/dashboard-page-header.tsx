import { Separator } from '@/components/ui/separator';

interface Props {
  pageTitle: string;
}

export function DashboardPageHeader({ pageTitle }: Props) {
  return (
    <div>
      <h1 className="text-lg font-semibold md:text-4xl">{pageTitle}</h1>
      <Separator className={'relative bg-border my-8 dashboard-header-highlight'} />
    </div>
  );
}
