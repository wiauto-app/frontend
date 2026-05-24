import Link from "next/link";

const BRAND_BLUE = "#0061F2";

export const NavbarBrand = () => {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span
        className="inline-flex size-9 items-center justify-center rounded-lg text-lg font-bold text-white"
        style={{ backgroundColor: BRAND_BLUE }}
      >
        W
      </span>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-slate-900">Wi</span>
        <span style={{ color: BRAND_BLUE }}>Auto</span>
      </span>
    </Link>
  );
};
