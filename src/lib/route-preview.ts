import type { Mode } from "./trips";

export type LatLng = [number, number];

/** Default start: the crossing at Koskikatu & Rovakatu (used when own location is unavailable). */
export const crossingStart: LatLng = [66.5023, 25.7298];

/** Approximate destination coordinates matching trip destination ids. */
export const destinationCoords: Record<string, LatLng> = {
  santa: [66.5436, 25.8476],
  arktikum: [66.5076, 25.7263],
  station: [66.4982, 25.7111],
  ounasvaara: [66.4968, 25.7675],
  airport: [66.5648, 25.8304],
};

export const modeColors: Record<Mode, string> = { walk: "var(--signal)", bus: "var(--aurora-2)", ride: "var(--amber)" };
export const modeLabels: Record<Mode, string> = { walk: "Kävely", bus: "Bussi", ride: "Kimppakyyti" };

/** Fetch a real street route from the public OSRM demo server (OpenStreetMap data). Returns null on failure. */
export async function fetchStreetRoute(from: LatLng, to: LatLng, mode: Mode): Promise<LatLng[] | null> {
  const profile = mode === "walk" ? "foot" : "driving";
  try {
    const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`);
    if (!res.ok) return null;
    const data = await res.json();
    const coords: [number, number][] | undefined = data?.routes?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    return null;
  }
}

/** Illustrative route shape (not real road routing): slight curve, different per mode so previews are distinguishable. */
export function previewPath(from: LatLng, to: LatLng, mode: Mode): LatLng[] {
  const bend = mode === "walk" ? 0 : mode === "bus" ? 0.18 : -0.18;
  const steps = 12;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  const pts: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const curve = Math.sin(Math.PI * t) * bend;
    pts.push([from[0] + dLat * t - dLng * curve * 0.45, from[1] + dLng * t + dLat * curve * 2.2]);
  }
  return pts;
}
