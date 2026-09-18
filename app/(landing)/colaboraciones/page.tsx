import { redirect } from "next/navigation";

/**
 * Redirect /colaboraciones to /servicios or show list.
 * For now, redirect to servicios since that's the main services hub.
 */
export default function ColaboracionesIndexPage() {
  redirect("/servicios");
}
