import logoImage from "figma:asset/f1f38fdc2ef276913b86dc569d4ffd5f95526a43.png";

export function DrssedLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoImage}
      alt="drssed"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
