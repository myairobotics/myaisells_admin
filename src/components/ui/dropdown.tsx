'use client';

import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/libs';

export const DropdownRoot = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownGroup = DropdownMenuPrimitive.Group;
export const DropdownPortal = DropdownMenuPrimitive.Portal;
export const DropdownSub = DropdownMenuPrimitive.Sub;
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownContent = ({ ref, className, sideOffset = 6, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.Content> | null> }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[200] min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);
DropdownContent.displayName = 'DropdownContent';

export const DropdownLabel = ({ ref, className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.Label> | null> }) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase', className)}
    {...props}
  />
);
DropdownLabel.displayName = 'DropdownLabel';

export const DropdownItem = ({ ref, className, inset, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
} & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.Item> | null> }) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
);
DropdownItem.displayName = 'DropdownItem';

export const DropdownSeparator = ({ ref, className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.Separator> | null> }) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-100', className)}
    {...props}
  />
);
DropdownSeparator.displayName = 'DropdownSeparator';

export const DropdownSubTrigger = ({ ref, className, inset, children, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
} & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.SubTrigger> | null> }) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:bg-slate-100 data-[state=open]:bg-slate-100',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.SubTrigger>
);
DropdownSubTrigger.displayName = 'DropdownSubTrigger';

export const DropdownSubContent = ({ ref, className, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.SubContent> | null> }) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-[200] min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10',
      className,
    )}
    {...props}
  />
);
DropdownSubContent.displayName = 'DropdownSubContent';

export const DropdownCheckboxItem = ({ ref, className, children, checked, ...props }: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & { ref?: React.RefObject<ElementRef<typeof DropdownMenuPrimitive.CheckboxItem> | null> }) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-lg py-2 pr-3 pl-8 text-sm font-medium text-slate-700 outline-none transition-colors focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);
DropdownCheckboxItem.displayName = 'DropdownCheckboxItem';

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
};

export function Dropdown({ trigger, children, align = 'end', side = 'bottom', className }: DropdownProps) {
  return (
    <DropdownRoot>
      <DropdownTrigger asChild>{trigger}</DropdownTrigger>
      <DropdownContent align={align} side={side} className={className}>
        {children}
      </DropdownContent>
    </DropdownRoot>
  );
}
