import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Search, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RovaniemiMap from "@/components/rovaniemi-map";
import { filterMapPlaces, mapCategories, mapPlaces, type MapPlace, type PlaceCategory } from "@/lib/map-places";

export const Route = createFileRoute("/kartta")({
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
  const [categories, setCategories] = useState<PlaceCategory[]>(mapCategories.map((c) => c.id));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const places = useMemo(() => filterMapPlaces(mapPlaces, categories, query), [categories, query]);
  const selectPlace = useCallback((place: MapPlace) => setSelected(place), []);
  const toggle = (id: PlaceCategory) => {
    setCategories((current) => current.includes(id) ? current.filter((c) => c !== id) : [...current, id]);
    setSelected(null);
  };

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
      </div>
      <p className="mb-4 border-l-2 border-amber pl-3 text-sm text-fog">Liikkumis- ja palvelupisteet ovat esimerkkejä, eivät vahvistettuja pysäkkejä tai vuokrauspisteitä. Ei reaaliaikaista saatavuutta.</p>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="isolate overflow-hidden rounded-lg border border-border"><ClientOnly fallback={<div className="grid h-[440px] place-items-center bg-panel md:h-[620px]">Karttaa ladataan…</div>}><RovaniemiMap places={places} selected={selected} onSelect={selectPlace} /></ClientOnly></div>
        <aside className="min-w-0" aria-label="Paikkojen tiedot">
          {selected ? <section className="mb-5 border-b border-border pb-5" aria-live="polite">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-signal">{mapCategories.find((c) => c.id === selected.category)?.label}</p><Button variant="ghost" size="icon" aria-label="Sulje paikan tiedot" onClick={() => setSelected(null)}><X /></Button></div>
            <h2 className="mt-1 font-display text-2xl">{selected.name}</h2>
            {selected.sample && <span className="mt-2 inline-block text-xs text-amber">ESIMERKKIPISTE</span>}
            <p className="mt-3 flex items-start gap-2 text-sm text-fog"><MapPin className="size-4 shrink-0" />{selected.address}</p>
            <p className="mt-3 text-sm leading-relaxed">{selected.description}</p>
            <Button variant="outline" asChild className="mt-4 w-full"><a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`} target="_blank" rel="noopener noreferrer"><ExternalLink />Avaa OpenStreetMapissa</a></Button>
          </section> : <div className="mb-4 border-b border-border pb-4"><h2 className="font-display text-xl">Paikat kartalla</h2><p className="mt-1 text-sm text-fog">Rovaniemen keskusta ja lähialueet</p></div>}
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-medium">Paikat</h3><span className="kbd text-xs text-fog">{places.length}</span></div>
          <div className="max-h-[390px] space-y-1 overflow-y-auto">
            {places.length === 0 && <div className="py-6"><p className="text-sm text-fog">Ei paikkoja näillä valinnoilla.</p><Button variant="outline" className="mt-3" onClick={() => { setCategories(mapCategories.map((c) => c.id)); setQuery(""); }}>Tyhjennä suodattimet</Button></div>}
            {places.map((place) => <Button key={place.id} variant="ghost" className={`h-auto w-full justify-start whitespace-normal py-3 text-left ${selected?.id === place.id ? "bg-accent" : ""}`} onClick={() => selectPlace(place)} aria-pressed={selected?.id === place.id}><span className={`list-symbol pin-${place.category}`} aria-hidden>{mapCategories.find((c) => c.id === place.category)?.symbol}</span><span className="min-w-0"><span className="block">{place.name}</span><span className="block text-xs font-normal text-fog">{place.sample ? "Esimerkki · " : ""}{place.address}</span></span></Button>)}
          </div>
        </aside>
      </div>
      <footer className="kbd mt-5 text-xs text-fog">CROSSING · ROVANIEMI / Kartta © OpenStreetMap</footer>
    </div>
  </main>;
}