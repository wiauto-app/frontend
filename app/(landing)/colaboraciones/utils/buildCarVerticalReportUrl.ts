const CAR_VERTICAL_DEAL_BASE =
  "https://www.carvertical.deal/2MLHC3D/CDLHJH/";

export const normalizeCarVerticalSub3 = (value: string): string =>
  value.trim().toUpperCase().replace(/[\s-]+/g, "");

export const buildCarVerticalReportUrl = (sub3: string): string => {
  const url = new URL(CAR_VERTICAL_DEAL_BASE);
  url.searchParams.set("uid", "293");
  url.searchParams.set("source_id", "AFF");
  url.searchParams.set("sub1", "wiauto");
  url.searchParams.set("sub3", normalizeCarVerticalSub3(sub3));
  return url.toString();
};
