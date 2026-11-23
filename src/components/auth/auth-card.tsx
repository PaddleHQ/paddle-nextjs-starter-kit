import Image from "next/image";
import type { ReactNode } from "react";

const PANEL = "mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16";

interface Props {
  title: string;
  form: ReactNode;
  github: ReactNode | null;
  footer: ReactNode;
}

export function AuthCard({ title, form, github, footer }: Props) {
  return (
    <div className="flex flex-col">
      <div className="mx-auto mt-[112px] w-[343px] flex-col gap-5 rounded-lg rounded-b-none bg-background/80 backdrop-blur-[6px] login-card-border md:w-[488px]">
        <div className="login-background-base login-card-hard-blur" />
        <div className="login-background-base login-card-vertical-hard-blur" />
        <div className="login-background-base login-card-small-soft-blur md:login-card-medium-soft-blur login-card-soft-blur" />
        <div className="login-background-base login-card-yellow-highlight login-card-small-yellow-highlight md:login-card-medium-yellow-highlight" />
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 pb-6 md:px-16">
          <Image src="/assets/icons/logo/aeroedit-icon.svg" alt="AeroEdit" width={80} height={80} priority />
          <h1 className="text-center text-[30px] leading-[36px] font-medium tracking-[-0.6px]">{title}</h1>
          {form}
        </div>
      </div>
      {github && <div className={`${PANEL} flex flex-col items-center justify-center gap-6 py-8 pt-0`}>{github}</div>}
      <div className={`${PANEL} flex flex-col items-center justify-center gap-6 rounded-b-lg py-8 pt-0`}>
        <div className="mt-4 text-center text-sm font-medium text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
