'use client';
import type { ReactNode } from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { store } from '@/store';
import NextAuthProvider from './NextAuthProvider';
import ToastProvider from './ToastProvider';

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthProvider>
      <ReduxProvider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ToastProvider />
        <PostHogProvider>
          {children}
        </PostHogProvider>
        {/* </PersistGate> */}
      </ReduxProvider>
    </NextAuthProvider>
  );
};

export default Provider;
