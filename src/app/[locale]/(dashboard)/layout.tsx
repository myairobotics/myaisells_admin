import React from 'react';

import BaseTemplate from '@/templates/BaseTemplate';
import '@/styles/global.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BaseTemplate>
          {children}
        </BaseTemplate>
      </body>
    </html>
  );
}
