'use client'

import dynamic from 'next/dynamic'
import ClientOnly from '@/components/ClientOnly'

// Dynamically import the main app component with no SSR
const GenifyApp = dynamic(() => import('@/components/GenifyApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Genify</h2>
        <p className="text-gray-600">Preparing your AI-powered web app generator...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Genify</h2>
            <p className="text-gray-600">Setting up client-side rendering...</p>
          </div>
        </div>
      }
    >
      <GenifyApp />
    </ClientOnly>
  )
}