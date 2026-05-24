import Link from "next/link";

export function NavbarPublishButton() {
  return (
    <Link
      href="/crear-vehiculo"
      className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#0061F2" }}
    >
      Publicar
    </Link>
  );
}
