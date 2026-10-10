import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { mapCategories, type MapPlace } from "@/lib/map-places";

type Props = { places: MapPlace[]; selected: MapPlace | null; onSelect: (place: MapPlace) => void };

export default function RovaniemiMap({ places, selected, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
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
      markers.current = L.layerGroup().addTo(instance);
      setReady(true);
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; map.current?.remove(); map.current = null; };
  }, []);

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
        const marker = L.marker([place.lat, place.lng], {
          icon: L.divIcon({ className: `crossing-pin pin-${place.category}${active ? " is-selected" : ""}`, html: `<span>${category?.symbol ?? "•"}</span>`, iconSize: [38, 38], iconAnchor: [19, 38] }),
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