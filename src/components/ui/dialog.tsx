'use client';

import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FiX } from 'react-icons/fi';
import { cn } from '@/libs';
import { VisuallyHidden } from './visually-hidden';

export const DialogRoot = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = ({ ref, className, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { ref?: React.RefObject<ElementRef<typeof DialogPrimitive.Overlay> | null> }) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = 'DialogOverlay';

type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  title?: string;
  description?: string;
  hideClose?: boolean;
};

export const DialogContent = ({ ref, className, children, title, description, hideClose, ...props }: DialogContentProps & { ref?: React.RefObject<ElementRef<typeof DialogPrimitive.Content> | null> }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
        className,
      )}
      {...props}
    >
      {title
        ? (
            <DialogPrimitive.Title className="mb-1 text-lg font-bold text-slate-800">
              {title}
            </DialogPrimitive.Title>
          )
        : (
            <VisuallyHidden>
              <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
            </VisuallyHidden>
          )}

      {description
        ? (
            <DialogPrimitive.Description className="mb-4 text-sm text-slate-500">
              {description}
            </DialogPrimitive.Description>
          )
        : (
            <VisuallyHidden>
              <DialogPrimitive.Description>Dialog content</DialogPrimitive.Description>
            </VisuallyHidden>
          )}

      {children}

      {!hideClose && (
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
          <FiX className="h-5 w-5" />
          <VisuallyHidden>Close</VisuallyHidden>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = 'DialogContent';
