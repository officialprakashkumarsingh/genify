'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const logs: string[] = []
    
    // Basic JavaScript test
    logs.push('✅ JavaScript is executing')
    
    // React test
    logs.push('✅ React hooks working')
    
    // Tailwind test
    const testDiv = document.createElement('div')
    testDiv.className = 'bg-red-500'
    document.body.appendChild(testDiv)
    const styles = window.getComputedStyle(testDiv)
    const bgColor = styles.backgroundColor
    document.body.removeChild(testDiv)
    
    if (bgColor === 'rgb(239, 68, 68)' || bgColor.includes('239')) {
      logs.push('✅ Tailwind CSS is working')
    } else {
      logs.push(`❌ Tailwind CSS not working (bg-color: ${bgColor})`)
    }
    
    // Environment test
    logs.push(`🌐 Environment: ${typeof window !== 'undefined' ? 'Browser' : 'Server'}`)
    logs.push(`📍 Location: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}`)
    logs.push(`🔧 User Agent: ${typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'}`)
    
    setDiagnostics(logs)
  }, [])

  if (!isClient) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🔄 Loading Diagnostics...</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Genify Debug Page</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">System Diagnostics</h2>
            <div className="space-y-2">
              {diagnostics.map((log, index) => (
                <div key={index} className="font-mono text-sm">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-green-900 mb-3">CSS Test</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-500 text-white p-3 rounded">Red Background</div>
              <div className="bg-blue-500 text-white p-3 rounded">Blue Background</div>
              <div className="bg-green-500 text-white p-3 rounded">Green Background</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-yellow-900 mb-3">Interactive Test</h2>
            <button 
              onClick={() => alert('Button clicked! React is working!')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test Button Click
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">API Test</h2>
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('https://longcat-openai-api.onrender.com/v1/models', {
                    headers: {
                      'Authorization': 'Bearer pikachu@#25D',
                      'Content-Type': 'application/json'
                    }
                  })
                  if (response.ok) {
                    const data = await response.json()
                    alert(`✅ API Working! Found ${data.data?.length || 0} models`)
                  } else {
                    alert(`❌ API Error: ${response.status}`)
                  }
                } catch (error) {
                  alert(`❌ API Failed: ${error}`)
                }
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test API Connection
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-800 text-green-400 rounded-lg font-mono text-sm">
          <div>Build Time: {new Date().toISOString()}</div>
          <div>Next.js: Client-side rendering active</div>
          <div>Status: {isClient ? '✅ Hydrated' : '⏳ Hydrating'}</div>
        </div>
      </div>
    </div>
  )
}