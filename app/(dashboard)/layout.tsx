import Layout from "@/components/Atoms/Layout";
import ToastProvider from "@/components/Molecules/ToastProvider";
import React from "react";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <ToastProvider />
          {children}
        </Layout>
      </body>
    </html>
  );
}
