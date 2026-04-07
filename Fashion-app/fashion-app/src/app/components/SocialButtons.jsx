import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function SocialButtons({
  onGoogle,
  onFacebook,
  googleLabel = "Google",
  facebookLabel = "Facebook",
}) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onGoogle}
        className="flex-1 flex items-center justify-center gap-2 border rounded-2xl p-2 shadow hover:bg-gray-100 bg-white text-[#2D2D2D] transition"
      >
        <FcGoogle size={28} />
        <span className="font-semibold">{googleLabel}</span>
      </button>

      <button
        type="button"
        onClick={onFacebook}
        className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white border rounded-2xl p-2 shadow hover:opacity-90 transition"
      >
        <FaFacebook size={28} />
        <span className="font-semibold">{facebookLabel}</span>
      </button>
    </div>
  );
}