import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function SocialButtons({
  onGoogle,
  onFacebook,
  variant = "light",
  googleLabel = "Google",
  facebookLabel = "Facebook",
}) {
  const isDark = variant === "dark";

  const googleButtonClass = isDark
    ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
    : "bg-white hover:bg-[#E76F51]/5 border border-[#E76F51]/20 text-[#2D2D2D]";

  const facebookButtonClass = isDark
    ? "bg-[#1877F2] hover:bg-[#165FDB] text-white"
    : "bg-[#1877F2] hover:bg-[#165FDB] text-white";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        className={`w-full h-12 rounded-xl flex items-center justify-start gap-3 px-4 transition ${googleButtonClass}`}
      >
        <FcGoogle className="w-5 h-5 flex-shrink-0" />
        <span className="font-['Raleway'] font-semibold">Continue with {googleLabel}</span>
      </button>

      <button
        type="button"
        onClick={onFacebook}
        className={`w-full h-12 rounded-xl flex items-center justify-start gap-3 px-4 transition ${facebookButtonClass}`}
      >
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-full bg-white/15 text-sm font-bold text-white">
          f
        </span>
        <span className="font-['Raleway'] font-semibold">Continue with {facebookLabel}</span>
      </button>
    </div>
  );
}