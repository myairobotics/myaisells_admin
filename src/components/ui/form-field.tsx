import type { InputHTMLAttributes, ReactNode } from 'react';
import type { InputTypes } from '@/types';
import Input from './Input';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: InputTypes;
  inputWidth?: number | string;
  inputSize?: 'xs' | 'sm';
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  children?: ReactNode;
};

export function FormField({
  label,
  hint,
  error,
  required,
  id,
  className,
  labelClassName,
  inputClassName,
  children,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label
        htmlFor={fieldId}
        className={labelClassName ?? 'block text-sm font-semibold text-slate-700'}
      >
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
      </label>

      {hint && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}

      {children ?? (
        <Input
          id={fieldId}
          status={error ? 'error' : undefined}
          className={inputClassName}
          {...inputProps}
        />
      )}

      {error && (
        <p role="alert" className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
