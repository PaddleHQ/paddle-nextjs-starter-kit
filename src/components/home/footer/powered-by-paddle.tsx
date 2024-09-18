import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight } from 'lucide-react';

export function PoweredByPaddle() {
  return (
    <>
      <Separator className={'footer-border'} />
      <div
        className={
          'flex flex-col justify-center items-center gap-2 text-muted-foreground text-sm leading-[14px] py-[24px]'
        }
      >
        <div className={'flex justify-center items-center gap-2'}>
          <span className={'text-sm leading-[14px]'}>A Next.js template by</span>
          <Image src={'/assets/icons/logo/paddle-white-logo.svg'} alt={'Paddle logo'} width={54} height={14} />
        </div>
        <div className={'flex justify-center items-center gap-2 flex-wrap md:flex-nowrap'}>
          <Link className={'text-sm leading-[14px]'} href={'https://paddle.com'} target={'_blank'}>
            <span className={'flex items-center gap-1'}>
              Explore Paddle
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px]'} href={'https://www.paddle.com/legal/terms'} target={'_blank'}>
            <span className={'flex items-center gap-1'}>
              Terms of use
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px]'} href={'https://www.paddle.com/legal/privacy'} target={'_blank'}>
            <span className={'flex items-center gap-1'}>
              Privacy
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
