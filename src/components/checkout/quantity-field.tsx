import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  quantity: number;
  handleQuantityChange: (quantity: number) => void;
}

export function QuantityField({ handleQuantityChange, quantity }: Props) {
  return (
    <div className={'mt-3 bg-background gap-1 w-fit flex items-center rounded-sm border border-border p-[6px]'}>
      <Button
        disabled={quantity === 1}
        variant={'secondary'}
        className={
          'h-[32px] bg-[#182222] disabled:bg-transparent text-muted-foreground border-border w-[32px] p-0 rounded-[4px]'
        }
        onClick={() => handleQuantityChange(quantity - 1)}
      >
        <Minus />
      </Button>
      <span className={'text-center leading-[24px] bg-[#182222] rounded-[4px] w-[56px] px-2 py-1 text-xs'}>
        {quantity}
      </span>
      <Button
        variant={'secondary'}
        className={'h-[32px] bg-[#182222] text-muted-foreground border-border w-[32px] p-0 rounded-[4px]'}
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
