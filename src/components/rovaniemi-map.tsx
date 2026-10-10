import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { mapCategories, type MapPlace } from "@/lib/map-places";
import type { LatLng } from "@/lib/route-preview";

export type MapRoute = { id: string; path: LatLng[]; color: string; active: boolean };
type Props = {
  places: MapPlace[]; selected: MapPlace | null; onSelect: (place: MapPlace) => void;
  routes?: MapRoute[]; userLocation?: LatLng | null; start?: LatLng | null;
};

export default function RovaniemiMap({ places, selected, onSelect, routes = [], userLocation = null, start = null }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const routeLayer = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    import("leaflet").then((L) => {
      if (disposed || !container.current) return;
      const instance = L.map(container.current, { zoomControl: true }).setView([66.502, 25.725], 14);
      map.current = instance;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        maxZoom: 19,
      }).on("tileerror", () => { if (!disposed) setFailed(true); }).addTo(instance);
      routeLayer.current = L.layerGroup().addTo(instance);
      markers.current = L.layerGroup().addTo(instance);
      setReady(true);
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    import("leaflet").then((L) => {
      const layer = routeLayer.current;
      if (disposed || !layer) return;
      layer.clearLayers();
      const sorted = [...routes].sort((a, b) => Number(a.active) - Number(b.active));
      const css = getComputedStyle(document.documentElement);
      const resolve = (c: string) => c.startsWith("var(") ? css.getPropertyValue(c.slice(4, -1)).trim() || c : c;
      sorted.forEach((r) => {
        L.polyline(r.path, { color: resolve(r.color), weight: r.active ? 7 : 4, opacity: r.active ? 0.95 : 0.45, dashArray: r.active ? undefined : "6 8" }).addTo(layer);
      });
      if (start) L.marker(start, { icon: L.divIcon({ className: "route-start", html: "<span></span>", iconSize: [18, 18] }), title: "Lähtöpiste" }).addTo(layer);
      if (userLocation) L.marker(userLocation, { icon: L.divIcon({ className: "user-dot", html: "<span></span>", iconSize: [22, 22] }), title: "Oma sijainti", zIndexOffset: 1000 }).bindTooltip("Oma sijainti").addTo(layer);
      const active = routes.find((r) => r.active) ?? routes[0];
      if (active && map.current) map.current.fitBounds(L.latLngBounds(routes.flatMap((r) => r.path)), { padding: [40, 40], animate: false });
    });
    return () => { disposed = true; };
  }, [ready, routes, userLocation, start]);

  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    import("leaflet").then((L) => {
      const layer = markers.current;
      if (disposed || !layer) return;
      layer.clearLayers();
      places.forEach((place) => {
        const category = mapCategories.find((c) => c.id === place.category);
        const active = selected?.id === place.id;
        const bigScreens = place.bigScreens === true;
        const size = bigScreens ? 48 : 38;
        const marker = L.marker([place.lat, place.lng], {
          icon: L.divIcon({ className: `crossing-pin pin-${place.category}${bigScreens ? " has-screens" : ""}${active ? " is-selected" : ""}`, html: `<span>${category?.symbol ?? "•"}</span>`, iconSize: [size, size], iconAnchor: [size / 2, size] }),
          zIndexOffset: bigScreens ? 600 : 0,
          title: place.name,
          alt: place.name,
          keyboard: true,
        });
        const label = document.createElement("span");
        label.textContent = place.name;
        marker.bindTooltip(label, { direction: "top", offset: [0, -36] });
        marker.on("click", () => onSelect(place));
        marker.addTo(layer);
      });
    });
    return () => { disposed = true; };
  }, [ready, places, selected, onSelect]);

  useEffect(() => {
    if (ready && selected) map.current?.flyTo([selected.lat, selected.lng], 16, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.6 });
  }, [ready, selected]);

  return <div className="relative h-[440px] w-full md:h-[620px]">
    <div ref={container} className="h-full w-full" aria-label="Rovaniemen interaktiivinen kartta" />
    {!ready && !failed && <div className="absolute inset-0 z-[500] grid place-items-center bg-panel text-fog">Karttaa ladataan…</div>}
    {failed && <p role="status" className="absolute bottom-8 left-3 right-3 z-[500] rounded-md bg-background p-3 text-sm text-foreground">Karttapohjaa ei voitu ladata kokonaan. Voit silti tutkia paikkoja luettelosta.</p>}
  </div>;
}