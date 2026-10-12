import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Monitor, Search, ExternalLink, X, LocateFixed, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RovaniemiMap, { type MapRoute } from "@/components/rovaniemi-map";
import { filterMapPlaces, mapCategories, mapPlaces, type MapPlace, type PlaceCategory } from "@/lib/map-places";
import { destinations, fastest, type Mode } from "@/lib/trips";
import { crossingStart, destinationCoords, fetchStreetRoute, modeColors, modeLabels, previewPath, type LatLng } from "@/lib/route-preview";

type Search = { dest?: string | undefined; mode?: Mode | undefined };

export const Route = createFileRoute("/kartta")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const dest = s["dest"]; const mode = s["mode"];
    return {
      dest: typeof dest === "string" ? dest : undefined,
      mode: mode === "walk" || mode === "bus" || mode === "ride" ? mode : undefined,
    };
  },
  head: () => ({ meta: [
    { title: "Rovaniemen kartta — Crossing" },
    { name: "description", content: "Tutki Rovaniemen tärkeitä paikkoja sekä esimerkkipisteitä busseille, kimppakyydeille, takseille, potkulaudoille ja palveluille." },
    { property: "og:title", content: "Rovaniemen kartta — Crossing" },
    { property: "og:description", content: "Rovaniemen paikat ja liikkumispisteet yhdellä klikattavalla kartalla. Liikkumis- ja palvelupisteet ovat esimerkkitietoja." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: MapPage,
});

function MapPage() {
  const search = Route.useSearch();
  const [categories, setCategories] = useState<PlaceCategory[]>(mapCategories.map((c) => c.id));
  const [screensOnly, setScreensOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const [destId, setDestId] = useState<string | null>(search.dest && destinationCoords[search.dest] ? search.dest : null);
  const [previewMode, setPreviewMode] = useState<Mode | null>(search.mode ?? null);
  const [chosenMode, setChosenMode] = useState<Mode | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const places = useMemo(() => filterMapPlaces(mapPlaces, categories, query, screensOnly), [categories, query, screensOnly]);
  const selectPlace = useCallback((place: MapPlace) => setSelected(place), []);
  const toggle = (id: PlaceCategory) => {
    setCategories((current) => current.includes(id) ? current.filter((c) => c !== id) : [...current, id]);
    setSelected(null);
  };
  const destination = destinations.find((d) => d.id === destId) ?? null;
  const start = userLocation ?? crossingStart;
  const activeMode = chosenMode ?? previewMode ?? (destination ? fastest(destination.options) : null);
  const [streetPaths, setStreetPaths] = useState<Partial<Record<Mode, LatLng[]>>>({});
  useEffect(() => {
    if (!destination) { setStreetPaths({}); return; }
    let cancelled = false;
    const to = destinationCoords[destination.id]!;
    const modes: Mode[] = chosenMode ? [chosenMode] : ["walk", "bus", "ride"];
    Promise.all(modes.map(async (m) => [m, await fetchStreetRoute(start, to, m)] as const)).then((entries) => {
      if (cancelled) return;
      setStreetPaths(Object.fromEntries(entries.filter(([, path]) => path !== null)) as Partial<Record<Mode, LatLng[]>>);
    });
    return () => { cancelled = true; };
  }, [destination, start, chosenMode]);
  const routes = useMemo<MapRoute[]>(() => {
    if (!destination) return [];
    const to = destinationCoords[destination.id]!;
    const modes: Mode[] = chosenMode ? [chosenMode] : ["walk", "bus", "ride"];
    return modes.map((m) => ({ id: m, path: streetPaths[m] ?? previewPath(start, to, m), color: modeColors[m], active: m === activeMode }));
  }, [destination, start, activeMode, chosenMode, streetPaths]);
  const locate = () => {
    if (!navigator.geolocation) { setLocStatus("Selain ei tue sijaintia. Lähtöpisteenä on risteys."); return; }
    setLocStatus("Haetaan sijaintia…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserLocation([p.coords.latitude, p.coords.longitude]); setLocStatus(null); },
      () => setLocStatus("Sijaintia ei saatu. Lähtöpisteenä on risteys Koskikatu & Rovakatu."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const pickDest = (id: string) => { setDestId(id); setChosenMode(null); setPreviewMode(null); if (!userLocation) locate(); };

  return <main className="min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-signal"><span className="grid size-9 place-items-center rounded-md bg-signal text-background">C</span>CROSSING</Link>
        <Button asChild variant="outline"><Link to="/"><ArrowLeft />Matkavaihtoehdot</Link></Button>
      </header>
      <div className="mb-5 mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="kbd text-xs text-aurora">ROVANIEMI · NAPAPIIRI</p><h1 className="mt-2 font-display text-4xl">Rovaniemen kartta</h1></div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 size-4 text-fog" /><Input aria-label="Etsi paikkaa" placeholder="Etsi paikkaa tai katua" value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} className="bg-panel pl-9" /></div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2" aria-label="Karttakategoriat">
        {mapCategories.map((category) => <Button key={category.id} variant={categories.includes(category.id) ? "default" : "outline"} aria-pressed={categories.includes(category.id)} onClick={() => toggle(category.id)}><span aria-hidden className="kbd">{category.symbol}</span>{category.label}</Button>)}
        <Button variant={screensOnly ? "default" : "outline"} aria-pressed={screensOnly} onClick={() => { setScreensOnly((value) => !value); setSelected(null); }}><Monitor />Vain suuret näytöt</Button>
      </div>
      <p className="mb-4 border-l-2 border-amber pl-3 text-sm text-fog">Liikkumis- ja palvelupisteet ovat esimerkkejä, eivät vahvistettuja pysäkkejä tai vuokrauspisteitä. Ei reaaliaikaista saatavuutta. Renkaalla vilkuvat pisteet ovat suurten näytöiden paikkoja, joissa on paljon uusia käyttäjiä.</p>
      <section className="mb-5 rounded-lg border border-border bg-panel p-4" aria-label="Reitin esikatselu">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">Reitti kartalla</h2>
          <Button variant="outline" size="sm" onClick={locate}><LocateFixed />{userLocation ? "Päivitä oma sijainti" : "Käytä omaa sijaintia"}</Button>
        </div>
        {locStatus && <p role="status" className="mt-2 text-sm text-amber">{locStatus}</p>}
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Valitse määränpää">
          {destinations.map((d) => <Button key={d.id} variant={destId === d.id ? "default" : "outline"} aria-pressed={destId === d.id} onClick={() => pickDest(d.id)}>{d.name}</Button>)}
        </div>
        {destination && <div className="mt-4">
          <p className="text-sm text-fog">Esikatsele vaihtoehdot ja valitse sitten reitti. Viivat ovat havainnollisia, eivät tarkkoja katureittejä.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {destination.options.map((o) => {
              const active = activeMode === o.mode;
              const chosen = chosenMode === o.mode;
              return <div key={o.mode} className={`rounded-md border p-3 ${active ? "border-signal bg-accent" : "border-border"}`}>
                <p className="flex items-center justify-between text-sm font-medium"><span>{modeLabels[o.mode]}</span>{chosen && <Check className="size-4 text-signal" aria-label="Valittu" />}</p>
                <p className="kbd mt-1 text-xs text-fog">{o.name} · {o.minutes} MIN · {o.cost}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant={active && !chosen ? "default" : "outline"} onClick={() => setPreviewMode(o.mode)}>Esikatsele</Button>
                  <Button size="sm" variant={chosen ? "default" : "outline"} onClick={() => { setChosenMode(o.mode); setPreviewMode(o.mode); }}>Valitse</Button>
                </div>
              </div>;
            })}
          </div>
          {chosenMode && <p className="mt-3 text-sm text-signal">Valittu reitti: {modeLabels[chosenMode]} — {destination.name}. Lähtö: {userLocation ? "oma sijainti" : "risteys Koskikatu & Rovakatu"}.</p>}
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setDestId(null); setChosenMode(null); setPreviewMode(null); }}><X />Tyhjennä reitti</Button>
        </div>}
      </section>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="isolate overflow-hidden rounded-lg border border-border"><ClientOnly fallback={<div className="grid h-[440px] place-items-center bg-panel md:h-[620px]">Karttaa ladataan…</div>}><RovaniemiMap places={places} selected={selected} onSelect={selectPlace} routes={routes} userLocation={userLocation} start={destination ? start : null} /></ClientOnly></div>
        <aside className="min-w-0" aria-label="Paikkojen tiedot">
          {selected ? <section className="mb-5 border-b border-border pb-5" aria-live="polite">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-signal">{mapCategories.find((c) => c.id === selected.category)?.label}</p><Button variant="ghost" size="icon" aria-label="Sulje paikan tiedot" onClick={() => setSelected(null)}><X /></Button></div>
            <h2 className="mt-1 font-display text-2xl">{selected.name}</h2>
            {selected.bigScreens && <span className="mt-2 inline-block text-xs text-amber">SUURET NÄYTÖT · PALJON UUSIA KÄYTTÄJIÄ</span>}
            {selected.sample && <span className="mt-2 inline-block text-xs text-amber">ESIMERKKIPISTE</span>}
            <p className="mt-3 flex items-start gap-2 text-sm text-fog"><MapPin className="size-4 shrink-0" />{selected.address}</p>
            <p className="mt-3 text-sm leading-relaxed">{selected.description}</p>
            <Button variant="outline" asChild className="mt-4 w-full"><a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`} target="_blank" rel="noopener noreferrer"><ExternalLink />Avaa OpenStreetMapissa</a></Button>
          </section> : <div className="mb-4 border-b border-border pb-4"><h2 className="font-display text-xl">Paikat kartalla</h2><p className="mt-1 text-sm text-fog">Rovaniemen keskusta ja lähialueet</p></div>}
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-medium">Paikat</h3><span className="kbd text-xs text-fog">{places.length}</span></div>
          <div className="max-h-[390px] space-y-1 overflow-y-auto">
            {places.length === 0 && <div className="py-6"><p className="text-sm text-fog">Ei paikkoja näillä valinnoilla.</p><Button variant="outline" className="mt-3" onClick={() => { setCategories(mapCategories.map((c) => c.id)); setScreensOnly(false); setQuery(""); }}>Tyhjennä suodattimet</Button></div>}
            {places.map((place) => <Button key={place.id} variant="ghost" className={`h-auto w-full justify-start whitespace-normal py-3 text-left ${selected?.id === place.id ? "bg-accent" : ""}`} onClick={() => selectPlace(place)} aria-pressed={selected?.id === place.id}><span className={`list-symbol pin-${place.category}`} aria-hidden>{mapCategories.find((c) => c.id === place.category)?.symbol}</span><span className="min-w-0"><span className="block">{place.name}</span>{place.bigScreens && <span className="kbd block text-[10px] font-medium text-amber">SUURET NÄYTÖT</span>}<span className="block text-xs font-normal text-fog">{place.sample ? "Esimerkki · " : ""}{place.address}</span></span></Button>)}
          </div>
        </aside>
      </div>
      <footer className="kbd mt-5 text-xs text-fog">CROSSING · ROVANIEMI / Kartta © OpenStreetMap</footer>
    </div>
  </main>;
}