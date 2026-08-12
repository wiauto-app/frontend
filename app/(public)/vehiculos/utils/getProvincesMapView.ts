export interface ProvinceCenter {
  coordinates: [number, number]; // [lng, lat]
}

export interface ProvinceMapView {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export function getProvincesMapView(
  provinces: ProvinceCenter[],
): ProvinceMapView {
  if (!provinces.length) {
    return {
      center: {
        lat: 40.4168,
        lng: -3.7038,
      },
      zoom: 6,
    };
  }

  if (provinces.length === 1) {
    const [lng, lat] = provinces[0].coordinates;

    return {
      center: {
        lat,
        lng,
      },
      zoom: 9,
    };
  }

  const coordinates = provinces.map(
    (province) => province.coordinates,
  );

  const lngs = coordinates.map(([lng]) => lng);
  const lats = coordinates.map(([, lat]) => lat);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;

  const maxSpan = Math.max(lngSpan, latSpan);

  let zoom: number;

  if (maxSpan >= 15) {
    zoom = 5;
  } else if (maxSpan >= 10) {
    zoom = 6;
  } else if (maxSpan >= 5) {
    zoom = 7;
  } else if (maxSpan >= 2.5) {
    zoom = 8;
  } else if (maxSpan >= 1.2) {
    zoom = 9;
  } else if (maxSpan >= 0.6) {
    zoom = 10;
  } else if (maxSpan >= 0.3) {
    zoom = 11;
  } else {
    zoom = 12;
  }

  return {
    center: {
      lat: centerLat,
      lng: centerLng,
    },
    zoom,
  };
}