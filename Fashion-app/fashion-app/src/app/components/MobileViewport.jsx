export default function MobileViewport({ children }) {
  return (
    <div className="w-full max-w-[393px] min-h-screen bg-[#FAFAF8] shadow-2xl overflow-hidden relative">
      {children}
    </div>
  );
}