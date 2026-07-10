import Image from "next/image";
import Link from "next/link";
import { getFooterData } from "./services/footerService";
import type { FooterLinkItem, FooterSectionItem } from "./types/footer.types";

import { Separator } from "../ui/separator";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

interface FooterSectionColumnProps {
  section: FooterSectionItem;
  align?: "left" | "right";
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
    return <FaFacebook className="size-4" aria-hidden />;
  }

  if (normalized.includes("instagram")) {
    return <FaInstagram className="size-4" aria-hidden />;
  }

  if (normalized.includes("twitter") || normalized === "x") {
    return <FaTwitter className="size-4" aria-hidden />;
  }

  if (normalized.includes("linkedin")) {
    return <FaLinkedin className="size-4" aria-hidden />;
  }
  if (normalized.includes("youtube")) {
    return <FaYoutube className="size-4" aria-hidden />;
  }

  return (
    <span className="text-xs font-semibold" aria-hidden>
      {label.charAt(0).toUpperCase()}
    </span>
  );
};

const FooterSectionColumn = ({
  section,
  align = "left",
}: FooterSectionColumnProps) => (
  <div className={align === "right" ? "lg:text-right" : "lg:text-left"}>
    <h3 className="text-base font-bold">{section.title}</h3>
    {section.links.length > 0 ? (
      <ul className="mt-5 space-y-2.5">
        {section.links.map((link) => (
          <li key={link.id}>
            {isExternalUrl(link.url) ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/85 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.url}
                className="text-sm text-white/85 transition-colors hover:text-white"
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
      className="inline-flex min-w-9 min-h-9 items-center justify-center overflow-hidden rounded-full border border-muted-foreground text-white transition-opacity hover:opacity-90"
    >
      {link.image_url ? (
        <Image
          src={link.image_url}
          alt=""
          width={40}
          height={40}
          className="size-full object-cover"
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
    <footer
      className="text-white py-10 bg-primary-dark"
    
    >
      <div className="container-custom flex flex-col gap-5 ">
        <div className="flex gap-10">
          <div className="space-y-6">
            {data.logo_url && (
              <Image
                src={data.logo_url}
                alt="Logo"
                width={225}
                height={75}
                className="object-contain"
              />
            )}
            <p className="text-sm text-white/85 max-w-sm">{data.description}</p>
            <div className="flex items-center gap-2">
              {data.social_links.map((link) => (
                <SocialLinkButton key={link.id} link={link} />
              ))}
            </div>
          </div>

          {data.sections.length > 0 &&
            data.sections.map((section) => (
              <FooterSectionColumn key={section.id} section={section} />
            ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/85">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
