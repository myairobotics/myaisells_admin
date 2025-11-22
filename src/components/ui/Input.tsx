'use client';

import type { InputHTMLAttributes } from 'react';
import type { InputTypes } from '@/types';
import {
  InfoOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import React, { useState } from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
  React.ComponentProps<'input'> {
  validationError?: string;
  isValid?: boolean | undefined;
  handleInputChange?: React.ChangeEvent<HTMLInputElement>;
  inputWidth?: number | string;
  status?: string;
  type?: InputTypes;
  inputSize?: 'xs' | 'sm';
}

const Input: React.FC<InputProps> = ({
  className,
  validationError,
  isValid,
  inputWidth,
  status,
  type: Type,
  ...inputProps
}) => {
  const [showInput, setShowInput] = useState<boolean | undefined>(false);

  const showInputField = () => {
    setShowInput(!showInput);
  };

  const statusColor
    = status === 'success'
      ? '#06C270'
      : status === 'warning'
        ? '#FFCC00'
        : status === 'error'
          ? '#FF3B3B'
          : '#1E1E1E60';
  return (
    <div
      className="w-full space-y-1"
      style={{
        width:
          inputWidth && typeof inputWidth === 'string'
            ? ''
            : inputWidth && typeof inputWidth === 'number'
              ? '' + 'px'
              : '',
      }}
    >
      <div className="relative flex w-full items-center">
        <input
          type={showInput ? '' : Type}
          {...inputProps}
          className={`${className} relative rounded-lg border-primary-700/30! px-3 py-2 placeholder:text-sm`}
          style={{
            width: '100%',
            border: `1.5px solid ${statusColor}`,
            outline: 'none',
          }}
        />
        {Type === 'password' && showInput
          ? (
              <VisibilityOutlined
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[1.2rem]! text-primary-700/30"
                onClick={showInputField}
              />
            )
          : Type === 'password' && !showInput
            ? (
                <VisibilityOffOutlined
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[1.2rem]! text-primary-700/30"
                  onClick={showInputField}
                />
              )
            : (
                ''
              )}
      </div>
      {validationError && isValid && (
        <div className="flex items-center space-x-1">
          <span className="flex items-center">
            <InfoOutlined
              sx={{ fontSize: '1.2rem', color: `${statusColor}` }}
            />
          </span>
          <p style={{ color: `${statusColor}` }}>{validationError}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
