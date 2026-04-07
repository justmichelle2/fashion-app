export function BeeLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wings (flowing thread) */}
      <path
        d="M30 40C20 35 15 30 18 22C20 16 25 15 30 18C32 20 33 23 33 27"
        stroke="#4B5563"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M70 40C80 35 85 30 82 22C80 16 75 15 70 18C68 20 67 23 67 27"
        stroke="#4B5563"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Body - formed by coiled measuring tape */}
      <ellipse cx="50" cy="45" rx="18" ry="20" fill="#EAB308" />
      
      {/* Measuring tape markings on body */}
      <line x1="40" y1="35" x2="60" y2="35" stroke="#111827" strokeWidth="1.5" />
      <line x1="40" y1="40" x2="60" y2="40" stroke="#111827" strokeWidth="1.5" />
      <line x1="40" y1="45" x2="60" y2="45" stroke="#111827" strokeWidth="1.5" />
      <line x1="40" y1="50" x2="60" y2="50" stroke="#111827" strokeWidth="1.5" />
      <line x1="40" y1="55" x2="60" y2="55" stroke="#111827" strokeWidth="1.5" />
      
      {/* Head */}
      <circle cx="50" cy="25" r="10" fill="#EAB308" />
      
      {/* Eyes */}
      <circle cx="46" cy="24" r="2" fill="#111827" />
      <circle cx="54" cy="24" r="2" fill="#111827" />
      
      {/* Antennae (thread) */}
      <path
        d="M45 17C43 12 40 8 38 8"
        stroke="#4B5563"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55 17C57 12 60 8 62 8"
        stroke="#4B5563"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="38" cy="8" r="2" fill="#006D5B" />
      <circle cx="62" cy="8" r="2" fill="#006D5B" />
      
      {/* Stinger (needle) */}
      <path
        d="M50 65L50 80"
        stroke="#111827"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M50 80L48 85L50 80L52 85L50 80"
        stroke="#111827"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Thread from needle */}
      <path
        d="M50 65C52 70 55 72 58 73"
        stroke="#006D5B"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
