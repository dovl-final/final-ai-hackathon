'use client';

import React from 'react';

// SessionProvider removed as part of disabling authentication

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>; // Render children directly
}
