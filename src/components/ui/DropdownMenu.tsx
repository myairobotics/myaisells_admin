'use client';

import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdLogout } from 'react-icons/md';

type Option = {
  id: string;
  name: string;
  logo?: string;
};

type voidFunction = () => void;

type DropdownMenuProps = {
  options: Option[];
  logoutAction: voidFunction;
  isOpen: boolean;
  closeAction: voidFunction;
  triggerRef: React.RefObject<HTMLElement | null>;
};

export const DropdownMenu = ({
  options,
  logoutAction,
  isOpen,
  closeAction,
  triggerRef,
}: DropdownMenuProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    minWidth: 0,
    maxHeight: 300,
    direction: 'down' as 'down' | 'up',
  });

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return null;
    }

    const rect = trigger.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = 320;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUp = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;

    const maxHeight = openUp
      ? Math.min(dropdownMaxHeight, spaceAbove - 10)
      : Math.min(dropdownMaxHeight, spaceBelow - 10);

    const topPosition = openUp
      ? rect.top + window.scrollY - maxHeight
      : rect.bottom + window.scrollY;

    return {
      top: topPosition,
      left: rect.left + window.scrollX,
      minWidth: rect.width,
      maxHeight,
      direction: openUp ? 'up' : 'down' as 'down' | 'up',
    };
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const update = () => {
      const pos = calculatePosition();
      if (pos) {
        setPosition(pos);
      }
    };

    requestAnimationFrame(update);

    const handler = () => requestAnimationFrame(update);

    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [isOpen, calculatePosition]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(e.target as Node)
        && triggerRef.current
        && !triggerRef.current.contains(e.target as Node)
      ) {
        closeAction();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeAction, triggerRef]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className={`absolute z-9999 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-2xl ring-2 ring-primary-200 transition-all duration-200 ${
        position.direction === 'down'
          ? 'slide-in-from-bottom-2'
          : 'slide-in-from-top-2'
      }`}
      style={{
        top: position.top,
        left: position.left,
        minWidth: position.minWidth,
        maxHeight: position.maxHeight,
        overflowY: 'auto',
      }}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      {options.length > 0 && (
        <div className="relative divide-y divide-primary-100">
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={closeAction}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-primary-50"
            >
              <div className="relative">
                <Image
                  width={36}
                  height={36}
                  className="rounded-full object-cover ring-2 ring-primary-200"
                  src={option.logo || '/assets/placeholder.jpg'}
                  alt="logo"
                />
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-slate-700">
                {option.name}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-primary-100 bg-primary-50/30">
        <button
          onClick={logoutAction}
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-error transition-all hover:bg-error-light"
          role="menuitem"
          tabIndex={-1}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-light">
            <MdLogout size={20} className="text-error" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>,
    document.body,
  );
};
