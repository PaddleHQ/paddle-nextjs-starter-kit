import Image from 'next/image';

export function BuiltUsingTools() {
  return (
    <div className={'mx-auto max-w-7xl text-center px-8 mt-24 mb-24'}>
      <span className={'text-base'}>Built with</span>
      <div className={'flex flex-row flex-wrap gap-6 justify-center md:justify-between items-center mt-8 md:gap-1'}>
        <Image src={'/assets/icons/logo/paddle-logo.svg'} alt={'TailwindCSS logo'} width={120} height={32} />
        <Image src={'/assets/icons/logo/tailwind-logo.svg'} alt={'TailwindCSS logo'} width={194} height={24} />
        <Image src={'/assets/icons/logo/supabase-logo.svg'} alt={'Supabase logo'} width={150} height={32} />
        <Image src={'/assets/icons/logo/nextjs-logo.svg'} alt={'Next.js logo'} width={120} height={24} />
        <Image src={'/assets/icons/logo/shadcn-logo.svg'} alt={'Shadcn logo'} width={137} height={32} />
      </div>
    </div>
  );
}
