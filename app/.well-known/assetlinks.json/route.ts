import { NextResponse } from "next/server";

/**
 * Android App Links (Digital Asset Links).
 *
 * TODO: sustituir el SHA-256 placeholder por la huella del keystore de release
 * (Play Console → App integrity / App signing, o `keytool -list -v -keystore …`).
 */
interface AssetLinkTarget {
  namespace: "android_app";
  package_name: string;
  sha256_cert_fingerprints: string[];
}

interface AssetLink {
  relation: string[];
  target: AssetLinkTarget;
}

const assetLinks: AssetLink[] = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.faux.wiauto",
      sha256_cert_fingerprints: [
        "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00",
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(assetLinks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
