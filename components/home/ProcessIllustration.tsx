const BLUE = "#0061F2";
const TAN = "#C4A574";

export function ProcessIllustration() {
  return (
    <svg
      viewBox="0 0 420 280"
      className="h-full w-full max-w-md"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="280" y="20" width="100" height="70" rx="8" fill={TAN} opacity="0.35" />
      <path
        d="M300 50c20-30 60-30 80 0v40H300V50z"
        fill={BLUE}
        opacity="0.15"
      />
      <path
        d="M310 35h50c8 0 14 6 14 14v30c0 8-6 14-14 14h-50c-8 0-14-6-14-14V49c0-8 6-14 14-14z"
        fill={BLUE}
        opacity="0.25"
      />
      <circle cx="335" cy="55" r="18" fill="none" stroke={BLUE} strokeWidth="6" opacity="0.4" />
      <rect x="325" y="70" width="20" height="35" rx="4" fill={BLUE} opacity="0.35" />

      <path
        d="M60 200h300l-15-45c-8-24-35-40-60-40h-90c-25 0-52 16-60 40L60 200z"
        fill={BLUE}
      />
      <path d="M90 155h90l12 20H78l12-20z" fill="#0050CC" />
      <path d="M180 155h90l15 20h-105l0-20z" fill="#0050CC" />
      <circle cx="115" cy="200" r="22" fill="#1e293b" />
      <circle cx="115" cy="200" r="12" fill="#64748b" />
      <circle cx="305" cy="200" r="22" fill="#1e293b" />
      <circle cx="305" cy="200" r="12" fill="#64748b" />

      <ellipse cx="210" cy="218" rx="120" ry="8" fill="#000" opacity="0.08" />

      <path d="M155 95v75M155 95c0-20 15-35 35-35h40c20 0 35 15 35 35" stroke="#334155" strokeWidth="2" fill="none" />
      <circle cx="175" cy="75" r="18" fill="#fcd9b6" />
      <path d="M160 55c5-12 25-12 30 0" fill="#4a3728" />
      <rect x="145" y="95" width="55" height="70" rx="4" fill="white" />
      <rect x="150" y="100" width="45" height="55" rx="2" fill={BLUE} opacity="0.2" />
      <path d="M145 165h20v25h-20z" fill="#1e293b" />
      <path d="M180 165h15v25h-15z" fill="#334155" />

      <circle cx="265" cy="72" r="18" fill="#fcd9b6" />
      <path d="M250 52c5-12 25-12 30 0" fill="#2d1f14" />
      <rect x="235" y="92" width="58" height="72" rx="4" fill="#3d4f3a" />
      <path d="M235 165h22v28h-22z" fill="#1e293b" />
      <path d="M271 165h22v28h-22z" fill="#334155" />

      <path
        d="M195 118c8-4 18-4 26 0M208 118c0 8 8 14 16 14s16-6 16-14"
        stroke="#fcd9b6"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="198" y="108" width="24" height="18" rx="2" fill="#fcd9b6" />
    </svg>
  );
}
