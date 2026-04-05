export default function MobileViewport({ children }) {
  return <div className="mx-auto w-full max-w-md min-h-screen bg-white">{children}</div>;
}
