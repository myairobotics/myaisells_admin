import { InputHTMLAttributes } from "react";

export type TResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type TErrorState = {
  state: boolean | string | undefined;
  status: number;
  message: string;
};

export type THandleSearchChange<T> = (
  e: React.ChangeEvent<HTMLInputElement>,
  config: {
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    initialData: T[];
    setSearchResults: React.Dispatch<React.SetStateAction<T[]>>;
  }
) => void;

export interface IImageUploadProps
  extends InputHTMLAttributes<HTMLInputElement> {
  fileType?: "video" | "image";
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<Blob | null | undefined | string>
  >;
  resetImageStates: () => void;
  selectedImage: Blob | null | undefined | string;
  previewImage: Blob | null | string;
  fileName: string;
}

export type TSelectOptions = (
  | string
  | { value: string; display_value: string; [x: string]: string }
)[];

export type InputType =
  | "button"
  | "text"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "time"
  | "week"
  | "url"
  | "select"
  | "textarea";
