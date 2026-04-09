import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center border border-[#E63946]/10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F5E6D3] flex items-center justify-center">
          <span className="text-3xl">404</span>
        </div>
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] mb-2">Page Not Found</h1>
        <p className="text-[#6B6B6B] text-sm font-['Raleway'] mb-6">
          The page you're looking for does not exist or was moved.
        </p>
        <div className="space-y-3">
          <Link
            to="/landing"
            className="block h-12 rounded-full bg-gradient-to-r from-[#E63946] to-[#D4AF37] text-white font-['Raleway'] font-semibold leading-[3rem] shadow-lg"
          >
            Back to Landing
          </Link>
          <Link
            to="/designers"
            className="block h-12 rounded-full border-2 border-[#E63946] text-[#E63946] font-['Raleway'] font-semibold leading-[2.75rem]"
          >
            Browse Designers
          </Link>
        </div>
      </div>
    </div>
  );
}
