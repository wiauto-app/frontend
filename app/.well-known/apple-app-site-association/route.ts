import { NextResponse } from "next/server";

/**
 * Apple App Site Association (Universal Links).
 *
 * TODO: sustituir TEAMID por el Apple Team ID real (Developer → Membership).
 * Formato appID: `<TEAM_ID>.<bundleIdentifier>` → p. ej. `AB12CD34EF.com.faux.wiauto`.
 */
interface AppleAppSiteAssociation {
  applinks: {
    apps: string[];
    details: Array<{
      appID: string;
      paths: string[];
    }>;
  };
}

const appleAppSiteAssociation: AppleAppSiteAssociation = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "TEAMID.com.faux.wiauto",
        paths: ["/auth/email-callback", "/auth/email-callback/*"],
      },
    ],
  },
};

export async function GET() {
  return NextResponse.json(appleAppSiteAssociation, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
