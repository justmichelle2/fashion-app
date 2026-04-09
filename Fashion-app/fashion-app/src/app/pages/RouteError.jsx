import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected routing error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data || "The requested page could not be loaded.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center border border-[#E63946]/10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E63946]/10 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] mb-2">{title}</h1>
        <p className="text-[#6B6B6B] text-sm font-['Raleway'] mb-6">{message}</p>
        <Link
          to="/landing"
          className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#E63946] to-[#D4AF37] px-6 text-white font-['Raleway'] font-semibold shadow-lg"
        >
          Go to Landing
        </Link>
      </div>
    </div>
  );
}
