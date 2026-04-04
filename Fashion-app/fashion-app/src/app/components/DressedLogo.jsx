import PropTypes from "prop-types";
import Logo from "../../assets/logo.png";

const getNumericSize = (value) => (typeof value === "number" ? value : parseFloat(value) || 120);

export default function DrssedLogo({ size = 120, className = "" }) {
  const numericSize = getNumericSize(size);
  const dimension = typeof size === "number" ? `${size}px` : size;

  return (
    <img
      src={Logo}
      alt="drssed"
      width={numericSize}
      height={numericSize}
      className={className}
      style={{ width: dimension, height: dimension, objectFit: "contain" }}
    />
  );
}

DrssedLogo.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};
