'use client';

import type { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function SidePanel({ open, onClose, title, subtitle, maxWidth = 'max-w-md', children, footer }: SidePanelProps) {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex h-full w-full flex-col bg-white shadow-2xl ${maxWidth}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          {subtitle
            ? (
                <div>
                  <h3 className="text-base font-bold text-slate-800">{title}</h3>
                  <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
              )
            : <h3 className="text-base font-bold text-slate-800">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer}
      </div>
    </div>
  );
}
