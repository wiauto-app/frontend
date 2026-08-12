

export interface Province {
  id: number;
  ogc_fid: number;
  cod_prov: string;
  name: string;
  cod_ccaa: string;
  slug: string;
  cartodb_id: number;
  image_url: string | null;
  geom: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
}