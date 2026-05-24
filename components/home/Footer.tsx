import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FOOTER_QUICK_LINKS,
  FOOTER_USEFUL_LINKS,
} from "./data/home-data";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "./SocialIcons";

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
] as const;

export function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #001B3D 0%, #032A52 55%, #043A6B 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="lg:text-left">
            <h3 className="text-base font-bold">Enlaces útiles</h3>
            <ul className="mt-5 space-y-2.5">
              {FOOTER_USEFUL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              wi<span className="font-extrabold">Auto</span>
            </Link>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-white text-[#001B3D] transition-opacity hover:opacity-90"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:text-right">
            <h3 className="text-base font-bold">Enlaces rápidos</h3>
            <ul className="mt-5 space-y-2.5">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-center lg:gap-x-12">
          <p className="inline-flex items-center gap-2 text-sm text-white/85">
            <MapPin className="size-4 shrink-0" aria-hidden />
            Detalle de la dirección física
          </p>
          <a
            href="mailto:info@wiauto.com"
            className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            info@wiauto.com
          </a>
          <a
            href="tel:+348483488384"
            className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            (+34) 848 348 8384
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row">
          <span className="font-semibold uppercase tracking-wide text-white">WIAuto</span>
          <span>Copyright © 2026. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
