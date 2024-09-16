import { LoaderIcon } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex items-center flex-col h-screen w-full mt-[100px]">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
