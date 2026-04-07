// Mobile viewport wrapper for iPhone 14/15 Pro simulation
export function MobileViewport({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[393px] h-[852px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* iPhone notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>
        
        {/* Content */}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
