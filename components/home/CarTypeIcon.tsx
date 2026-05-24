type CarTypeIconProps = {
  type: string;
  className?: string;
};

export function CarTypeIcon({ type, className = "h-10 w-[72px]" }: CarTypeIconProps) {
  const stroke = "currentColor";
  const props = {
    viewBox: "0 0 72 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "familiar":
      return (
        <svg {...props}>
          <path
            d="M8 26h48M12 26l3-8h18l4 8M20 18h16M14 26v4M54 26v4"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 22h10l4-6h20l6 6h16" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "micro":
      return (
        <svg {...props}>
          <path
            d="M14 24h36M16 24l2-6h20l2 6M22 18h8"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="28" r="2.5" stroke={stroke} strokeWidth="1.5" />
          <circle cx="46" cy="28" r="2.5" stroke={stroke} strokeWidth="1.5" />
          <path d="M14 22h8l2-5h16l2 5h16" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "sedan":
      return (
        <svg {...props}>
          <path
            d="M10 26h48M14 26l3-7h20l5 7M24 19h12"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M10 23h12l4-7h16l6 7h12" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "hatchback":
      return (
        <svg {...props}>
          <path
            d="M10 26h44M14 26l3-7h14l4 7M22 19h10"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="48" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M10 23h10l4-7h12l5 7h13" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "suv":
      return (
        <svg {...props}>
          <path
            d="M8 26h50M12 26l4-9h20l5 9M22 17h14"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="30" r="3.5" stroke={stroke} strokeWidth="1.5" />
          <circle cx="52" cy="30" r="3.5" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 22h12l5-9h18l6 9h12" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "pickup":
      return (
        <svg {...props}>
          <path
            d="M8 26h52M12 26l3-8h16l2 8h20"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="52" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 22h10l4-8h14v8h24" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "roadster":
      return (
        <svg {...props}>
          <path
            d="M12 28h44M16 28l2-5h20l4 5"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="48" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <path d="M12 26h8l6-10h12l8 10h10" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M10 26h48M14 26l3-7h20l5 7" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="20" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="30" r="3" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
  }
}
