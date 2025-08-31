import { MicdropLogo } from "@/components/ui/micdrop-logo"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <MicdropLogo showText={true} />
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-100 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
