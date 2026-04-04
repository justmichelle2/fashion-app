import { X, Shirt, Scissors, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ACTIONS = {
  signup: {
    title: "Choose your account type",
    subtitle: "Select how you want to continue.",
    customerPath: "/signup/customer",
    designerPath: "/signup/designer",
    customerLabel: "Customer",
    designerLabel: "Designer",
    customerDescription: "Browse and order custom designs",
    designerDescription: "Create and manage your business",
  },
  login: {
    title: "Sign in as",
    subtitle: "Choose the account that matches you.",
    customerPath: "/login/customer",
    designerPath: "/login/designer",
    customerLabel: "Customer",
    designerLabel: "Designer",
    customerDescription: "Access your orders and profile",
    designerDescription: "Manage orders and clients",
  },
};

export default function RoleSelector({ open, mode = "signup", onClose }) {
  const navigate = useNavigate();
  const config = ACTIONS[mode] || ACTIONS.signup;

  if (!open) return null;

  const handleSelect = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6 py-8">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-[#E76F51]/10 p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] mb-1">{config.title}</h2>
            <p className="text-[#6B6B6B] text-sm font-['Raleway']">{config.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F5E6D3]/50 hover:bg-[#F5E6D3] flex items-center justify-center transition"
            aria-label="Close role selector"
          >
            <X className="w-5 h-5 text-[#2D2D2D]" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSelect(config.customerPath)}
            className="w-full bg-white border-2 border-[#E76F51] rounded-2xl p-4 hover:bg-[#E76F51]/5 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-[#E76F51] rounded-full flex items-center justify-center flex-shrink-0">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#2D2D2D] mb-1 text-base font-semibold font-['Raleway']">{config.customerLabel}</h3>
                  <p className="text-[#6B6B6B] text-[13px] font-['Raleway']">{config.customerDescription}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(config.designerPath)}
            className="w-full bg-white border-2 border-[#2D2D2D] rounded-2xl p-4 hover:bg-[#2D2D2D]/5 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#2D2D2D] mb-1 text-base font-semibold font-['Raleway']">{config.designerLabel}</h3>
                  <p className="text-[#6B6B6B] text-[13px] font-['Raleway']">{config.designerDescription}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#2D2D2D] flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}