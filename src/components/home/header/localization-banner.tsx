import Image from 'next/image';
import Link from 'next/link';
import { CountryDropdown } from '@/components/home/header/country-dropdown';
import { ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  country: string;
  onCountryChange: (value: string) => void;
}
export function LocalizationBanner({ country, onCountryChange }: Props) {
  const [showBanner, setShowBanner] = useState(true);
  // TODO: This component is for demonstration purposes only. Please remove while integrating with the application.
  if (!showBanner) {
    return null;
  }
  return (
    <div className={'hidden md:flex border-border/50 border-b-2 bg-background'}>
      <div className={'flex flex-1 justify-center items-center p-2 gap-8'}>
        <div className={'flex items-center gap-4'}>
          <Image src={'/assets/icons/localization-icon.svg'} alt={'Localization Icon'} width={36} height={36} />
          <p className={'text-[16px] font-medium text-center'}>Preview localized prices</p>
          <Link
            className={'text-[16px] text-muted-foreground'}
            href={'https://developer.paddle.com/build/products/offer-localized-pricing'}
            target={'_blank'}
          >
            <span className={'flex items-center gap-1'}>
              Learn more
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
        </div>
        <div className={'flex items-center gap-4'}>
          <CountryDropdown country={country} onCountryChange={onCountryChange} />
          <X size={'16'} className={'cursor-pointer'} onClick={() => setShowBanner(false)} />
        </div>
      </div>
    </div>
  );
}
