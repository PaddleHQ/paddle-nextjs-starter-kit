import { CheckoutLineItems } from '@/components/checkout/checkout-line-items';
import { CheckoutPriceContainer } from '@/components/checkout/checkout-price-container';
import { CheckoutPriceAmount } from '@/components/checkout/checkout-price-amount';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { CheckoutEventsData } from '@paddle/paddle-js/types/checkout/events';

interface Props {
  checkoutData: CheckoutEventsData | null;
  quantity: number;
  handleQuantityChange: (quantity: number) => void;
}

export function PriceSection({ checkoutData, handleQuantityChange, quantity }: Props) {
  return (
    <>
      <div className={'hidden md:block'}>
        <CheckoutPriceContainer checkoutData={checkoutData} />
        <CheckoutLineItems
          handleQuantityChange={handleQuantityChange}
          checkoutData={checkoutData}
          quantity={quantity}
        />
      </div>
      <div className={'block md:hidden'}>
        <CheckoutPriceAmount checkoutData={checkoutData} />
        <Separator className={'relative bg-border/50 mt-6 checkout-order-summary-mobile-yellow-highlight'} />
        <Accordion type="single" collapsible>
          <AccordionItem className={'border-none'} value="item-1">
            <AccordionTrigger className={'text-muted-foreground !no-underline'}>Order summary</AccordionTrigger>
            <AccordionContent className={'pb-0'}>
              <CheckoutLineItems
                handleQuantityChange={handleQuantityChange}
                checkoutData={checkoutData}
                quantity={quantity}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
