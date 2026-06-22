'use client';

import type { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { DialogContent, DialogRoot, DialogTrigger } from './dialog';
import { DrawerContent, DrawerRoot, DrawerTrigger } from './drawer';

type ModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
};

export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
  hideClose,
}: ModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerRoot open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent title={title} description={description} className={className}>
          {children}
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        title={title}
        description={description}
        className={className}
        hideClose={hideClose}
      >
        {children}
      </DialogContent>
    </DialogRoot>
  );
}
