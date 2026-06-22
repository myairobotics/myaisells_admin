'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/libs';
import { VisuallyHidden } from './visually-hidden';

export const DrawerRoot = Drawer.Root;
export const DrawerTrigger = Drawer.Trigger;
export const DrawerClose = Drawer.Close;
export const DrawerPortal = Drawer.Portal;

export function DrawerOverlay({ className, ...props }: ComponentPropsWithoutRef<typeof Drawer.Overlay>) {
  return (
    <Drawer.Overlay
      className={cn('fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm', className)}
      {...props}
    />
  );
}

type DrawerContentProps = ComponentPropsWithoutRef<typeof Drawer.Content> & {
  title?: string;
  description?: string;
};

export function DrawerContent({ className, children, title, description, ...props }: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Drawer.Content
        className={cn(
          'fixed right-0 bottom-0 left-0 z-50 flex max-h-[90dvh] flex-col rounded-t-2xl bg-white shadow-2xl outline-none',
          className,
        )}
        {...props}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-2 h-1.5 w-10 shrink-0 rounded-full bg-slate-300" />

        <div className="overflow-y-auto px-6 pb-8">
          {title
            ? (
                <Drawer.Title className="mb-1 text-lg font-bold text-slate-800">{title}</Drawer.Title>
              )
            : (
                <VisuallyHidden>
                  <Drawer.Title>Drawer</Drawer.Title>
                </VisuallyHidden>
              )}

          {description
            ? (
                <Drawer.Description className="mb-4 text-sm text-slate-500">{description}</Drawer.Description>
              )
            : (
                <VisuallyHidden>
                  <Drawer.Description>Drawer content</Drawer.Description>
                </VisuallyHidden>
              )}

          {children}
        </div>
      </Drawer.Content>
    </DrawerPortal>
  );
}
