import type { InputHTMLAttributes } from 'react';

export type InputTypes
  = | 'button'
    | 'text'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'time'
    | 'week'
    | 'url'
    | 'select'
    | 'textarea';

export type SelectOption
  = | string
    | { value: string; displayValue: string; [key: string]: string };

export type ImageUploadProps = {
  fileType?: 'image' | 'video';
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<Blob | string | null | undefined>
  >;
  resetImageStates: () => void;
  selectedImage: Blob | string | null | undefined;
  previewImage: Blob | string | null;
  fileName: string;
} & InputHTMLAttributes<HTMLInputElement>;
