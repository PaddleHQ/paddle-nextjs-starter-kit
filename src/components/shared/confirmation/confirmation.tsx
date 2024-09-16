import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  title: ReactNode;
  description: ReactNode;
  onClose: (open: boolean) => void;
  onConfirm: () => void;
}

export function Confirmation({ isOpen, onClose, title, description, onConfirm }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className={'flex flex-col gap-6'}>
            <DialogDescription>{description}</DialogDescription>
            <div className={'flex gap-4 items-center justify-end w-full'}>
              <Button onClick={() => onClose(false)} variant={'outline'}>
                Close
              </Button>
              <Button onClick={() => onConfirm()} variant={'destructive'}>
                Cancel subscription
              </Button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
