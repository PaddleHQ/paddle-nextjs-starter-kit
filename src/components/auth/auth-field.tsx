import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends ComponentProps<"input"> {
  id: string;
  label: string;
}

export function AuthField({ id, label, className, ...props }: Props) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label className="leading-5 text-muted-foreground" htmlFor={id}>
        {label}
      </Label>
      <Input id={id} name={id} className="rounded-xs border-border" {...props} />
    </div>
  );
}
