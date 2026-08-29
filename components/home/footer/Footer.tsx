import Image from "next/image";
import Link from "next/link";
import { getFooterData } from "../services/footerService";
import type { FooterLinkItem, FooterSectionItem } from "../types/footer.types";

import { Separator } from "../../ui/separator";
import { CookiePreferencesButton } from "@/components/consent/cookiePreferencesButton";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FACEBOOK_COLOR,
  INSTAGRAM_COLOR,
  TELEGRAM_COLOR,
  YOUTUBE_COLOR,
} from "./footer.constants";
interface FooterSectionColumnProps {
  section: FooterSectionItem;
}

interface SocialLinkButtonProps {
  link: FooterLinkItem;
}

const isExternalUrl = (url: string): boolean =>
  url.startsWith("http://") || url.startsWith("https://");

const normalizeSocialLabel = (label: string): string =>
  label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const renderSocialIcon = (label: string) => {
  const normalized = normalizeSocialLabel(label);

  if (normalized.includes("facebook")) {
    return (
      <FaFacebook className="size-5 " color={FACEBOOK_COLOR} aria-hidden />
    );
  }

  if (normalized.includes("instagram")) {
    return (
      <FaInstagram className="size-5" color={INSTAGRAM_COLOR} aria-hidden />
    );
  }

  if (normalized.includes("twitter") || normalized === "x") {
    return <FaXTwitter className="size-5" aria-hidden />;
  }

  if (normalized.includes("linkedin")) {
    return <FaLinkedin className="size-5" aria-hidden />;
  }
  if (normalized.includes("youtube")) {
    return <FaYoutube className="size-5" color={YOUTUBE_COLOR} aria-hidden />;
  }
  if (normalized.includes("telegram")) {
    return <FaTelegram className="size-5" color={TELEGRAM_COLOR} aria-hidden />;
  }

  return (
    <span className="text-xs font-semibold" aria-hidden>
      {label.charAt(0).toUpperCase()}
    </span>
  );
};

const FooterSectionColumn = ({ section }: FooterSectionColumnProps) => (
  <div className="text-center lg:text-left">
    <p className="text-base font-bold">{section.title}</p>
    {section.links.length > 0 ? (
      <ul className="mt-4 space-y-2.5 sm:mt-5">
        {section.links.map((link) => (
          <li key={link.id}>
            {isExternalUrl(link.url) ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-white/85 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.url}
                className="inline-block text-sm text-white/85 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    ) : null}
  </div>
);

const SocialLinkButton = ({ link }: SocialLinkButtonProps) => {
  const external = isExternalUrl(link.url);

  return (
    <a
      href={link.url}
      aria-label={link.label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30 text-white transition-opacity hover:opacity-90"
    >
      {link.image_url ? (
        <Image
          src={link.image_url}
          alt=""
          width={40}
          height={40}
          className="size-full object-cover"
          style={{ width: "100%", height: "100%" }}
          aria-hidden
        />
      ) : (
        renderSocialIcon(link.label)
      )}
    </a>
  );
};

export async function Footer() {
  const data = await getFooterData();
  return (
    <footer className="bg-primary-dark py-10 text-white sm:py-12">
      <div className="container-custom flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left lg:max-w-xs lg:shrink-0 xl:max-w-sm">
            {data.logo_url ? (
              <Link href="/" className="inline-block">
                <Image
                  src={data.logo_url}
                  alt="WiAuto"
                  width={225}
                  height={75}
                  className="h-auto w-45 object-contain sm:w-52 lg:w-56"
                  style={{ height: "auto" }}
                />
              </Link>
            ) : null}
            {data.description ? (
              <p className="max-w-sm text-sm leading-relaxed text-white/85">
                {data.description}
              </p>
            ) : null}
            {data.social_links.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {data.social_links.map((link) => (
                  <SocialLinkButton key={link.id} link={link} />
                ))}
              </div>
            ) : null}
          </div>

          {data.sections.length > 0 ? (
            <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10 xl:grid-cols-6">
              {data.sections.map((section) => (
                <FooterSectionColumn key={section.id} section={section} />
              ))}
            </div>
          ) : null}
        </div>

        <Separator className="bg-white/15" />

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          {data.copyright ? (
            <p className="text-center text-xs text-white/70 sm:text-left sm:text-sm sm:text-white/85">
              {data.copyright}
            </p>
          ) : null}
          <CookiePreferencesButton className="text-xs text-white/70 underline underline-offset-2 transition-colors hover:text-white sm:text-sm" />
        </div>
      </div>
    </footer>
  );
}
