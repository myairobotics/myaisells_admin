export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type ApiAdminResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiError = {
  state: boolean | string | undefined;
  status: number;
  message: string;
};
