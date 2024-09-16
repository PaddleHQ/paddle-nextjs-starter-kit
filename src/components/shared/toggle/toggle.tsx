import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  frequency: IBillingFrequency;
  setFrequency: (frequency: IBillingFrequency) => void;
}

export function Toggle({ setFrequency, frequency }: Props) {
  return (
    <div className="flex justify-center mb-8">
      <Tabs
        value={frequency.value}
        onValueChange={(value) =>
          setFrequency(BillingFrequency.find((billingFrequency) => value === billingFrequency.value)!)
        }
      >
        <TabsList>
          {BillingFrequency.map((billingFrequency) => (
            <TabsTrigger key={billingFrequency.value} value={billingFrequency.value}>
              {billingFrequency.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
