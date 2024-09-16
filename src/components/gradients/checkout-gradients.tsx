export function CheckoutGradients() {
  return (
    <>
      <div className={'hidden md:block'}>
        <div className={'top-left-gradient-background checkout-background-base min-h-[1280px]'}></div>
        <div className={'bottom-right-gradient-background checkout-background-base min-h-[1280px]'}></div>
        <div className={'grain-background checkout-background-base min-h-[1280px]'}></div>
        <div className={'grid-bg checkout-background-base min-h-[1280px]'}></div>
      </div>
      <div className={'block md:hidden'}>
        <div className={'checkout-mobile-grainy-blur checkout-mobile-top-gradient checkout-background-base'}></div>
        <div className={'checkout-mobile-grainy-blur checkout-mobile-bottom-gradient checkout-background-base'}></div>
        <div className={'grain-background checkout-background-base h-full min-h-screen'}></div>
      </div>
    </>
  );
}
