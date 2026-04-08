import PropTypes from "prop-types";
import logo from "../../assets/logo.png";

const getNumericSize = (value) => (typeof value === "number" ? value : parseFloat(value) || 120);

export default function DressedLogo({ size = 120, className = "" }) {
  const numericSize = getNumericSize(size);
  const dimension = typeof size === "number" ? `${size}px` : size;
  const brandFontSize = `${Math.max(18, Math.round(numericSize * 0.26))}px`;
  const taglineFontSize = `${Math.max(10, Math.round(numericSize * 0.12))}px`;

  return (
    <div
      className={`flex flex-col items-center text-center ${className}`.trim()}
      style={{ gap: `${Math.max(12, Math.round(numericSize * 0.12))}px` }}
    >
      <img
        src={logo}
        alt="Drssed logo"
        className="w-20 h-20 mb-3 object-contain"
        style={{ width: dimension, height: dimension }}
      />
      <span
        className="uppercase text-[#2D2D2D]"
        style={{ fontSize: brandFontSize, letterSpacing: "0.55em" }}
      >
        drssed
      </span>
      <span
        className="uppercase text-[#F4A261]"
        style={{ fontSize: taglineFontSize, letterSpacing: "0.4em" }}
      >
        atelier
      </span>
    </div>
  );
}

DressedLogo.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};
