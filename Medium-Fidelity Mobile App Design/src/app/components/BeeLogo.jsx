export function BeeLogo({ className = "", size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="#FCD34D" />
      <path
        d="M30 45 L70 45 M30 50 L70 50 M30 55 L70 55"
        stroke="#000"
        strokeWidth="3"
      />
      <circle cx="40" cy="35" r="5" fill="#000" />
      <circle cx="60" cy="35" r="5" fill="#000" />
      <ellipse cx="25" cy="50" rx="10" ry="15" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="75" cy="50" rx="10" ry="15" fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}
