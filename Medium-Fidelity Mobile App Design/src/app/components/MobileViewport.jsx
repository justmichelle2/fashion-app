export function MobileViewport({ children }) {
  return (
    <div className="w-full max-w-[393px] mx-auto bg-white min-h-screen">
      {children}
    </div>
  );
}
