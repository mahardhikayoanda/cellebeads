'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/context/CartContext'
import { ReactNode } from 'react'
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </SessionProvider>
  )
}