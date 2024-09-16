'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { signInWithGithub } from '@/app/login/actions';
import Image from 'next/image';

interface Props {
  label: string;
}
export function GhLoginButton({ label }: Props) {
  return (
    <div
      className={
        'mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg'
      }
    >
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>or</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <Button onClick={() => signInWithGithub()} variant={'secondary'} className={'w-full'}>
        <Image
          height="24"
          className={'mr-3'}
          width="24"
          src="https://cdn.simpleicons.org/github/878989"
          unoptimized={true}
          alt={'GitHub logo'}
        />
        {label}
      </Button>
    </div>
  );
}
