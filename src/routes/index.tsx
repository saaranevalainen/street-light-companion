import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BusFront, CarFront, Clock3, Footprints, Map, Navigation, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { crossing, destinations, fastest, type Option } from "@/lib/trips";
import { partners } from "@/lib/partners";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crossing Rovaniemi — walk, bus or ride at the light" },
      {
        name: "description",
        content:
          "At a Rovaniemi crossing? Compare walk, Linkkari bus and shared ride times and prices, plus last-minute deals from nearby cafés and salons.",
      },
      { property: "og:title", content: "Crossing Rovaniemi — walk, bus or ride at the light" },
      {
        property: "og:description",
        content:
          "Live time and price comparison for walking, bus and shared rides, shown right at the traffic light.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function useClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useSignal() {
  const [seconds, setSeconds] = useState(18);
  const [green, setGreen] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        setGreen((g) => !g);
        return green ? 24 : 18;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [green]);

  return { seconds, green };
}

function ModeIcon({ mode }: { mode: Option["mode"] }) {
  if (mode === "walk") return <Footprints className="size-12" strokeWidth={1.7} />;
  if (mode === "bus") return <BusFront className="size-12" strokeWidth={1.7} />;
  return <CarFront className="size-12" strokeWidth={1.7} />;
}

function formatCost(cost: string) {
  return cost === "FREE" ? "0 €" : cost.replace("€", "€").replace(".", ",");
}

function Index() {
  const time = useClock();
  const { seconds, green } = useSignal();
  const [destinationId, setDestinationId] = useState(destinations[0]!.id);
  const [booked, setBooked] = useState<Record<string, boolean>>({});
  const [destinationQuery, setDestinationQuery] = useState("");

  const filteredDestinations = useMemo(() => {
    const search = destinationQuery.trim().toLocaleLowerCase("fi");
    return destinations.filter((item) => item.name.toLocaleLowerCase("fi").includes(search));
  }, [destinationQuery]);

  const destination = useMemo(
    () => destinations.find((d) => d.id === destinationId) ?? destinations[0]!,
    [destinationId],
  );
  const recommended = fastest(destination.options);
  const selected =
    destination.options.find((o) => o.mode === recommended) ?? destination.options[0]!;

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-signal selection:text-background">
      <div className="aurora-sky" aria-hidden>
        <div className="star-field" />
        <div
          className="aurora-band -top-[10vh]"
          style={{ background: "linear-gradient(90deg, transparent, var(--aurora), var(--aurora-2), transparent)", opacity: 0.45 }}
        />
        <div
          className="aurora-band top-[5vh]"
          style={{ background: "linear-gradient(100deg, transparent 10%, var(--aurora-3), var(--aurora), transparent 90%)", opacity: 0.3, animationDelay: "-6s", animationDuration: "19s" }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal font-display text-2xl leading-none text-background">
              C
            </div>
            <div className="min-w-0 leading-none">
              <div className="truncate font-display text-xl tracking-wide">CROSSING</div>
              <div className="kbd mt-1 truncate text-[10px] tracking-[0.2em] text-fog">
                {crossing.id} · {crossing.name}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button asChild variant="outline" className="gap-2"><Link to="/kartta"><Map /><span>Kartta</span></Link></Button>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-panel px-3 py-2 sm:flex">
              <span className="size-2 animate-pulse-dot rounded-full bg-signal" />
              <span className="kbd text-[11px] tracking-widest text-fog">LIVE</span>
            </div>
            <div className="kbd rounded-full border border-border bg-panel px-3 py-2 text-[11px] tracking-widest text-fog">
              {time ?? "--:--"}
            </div>
          </div>
        </header>

        <div
          className={`mt-5 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-5 ${
            green ? "bg-signal text-background" : "bg-card text-foreground"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`size-3 shrink-0 animate-tick rounded-full ${green ? "bg-background" : "bg-amber"}`}
            />
            <span className="truncate font-display text-lg tracking-wide sm:text-xl">
              {green ? "SIGNAL GREEN — GO" : "SIGNAL RED — WAIT"}
            </span>
          </div>
          <div className="flex shrink-0 items-end gap-2">
            <span className="kbd self-center text-[11px] tracking-widest">
              {green ? "CROSS IN" : "GREEN IN"}
            </span>
            <span className="font-display text-4xl leading-none sm:text-5xl">
              {String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <section className="route-showcase mt-4" aria-label="Reittivaihtoehdot">
          <div className="route-showcase-top">
            <div className="route-status-icon"><Footprints className="size-7" /></div>
            <div className="route-status-copy"><strong>{destination.name}</strong><span>Valitse sopivin tapa jatkaa</span></div>
            <Clock3 className="size-5 text-signal" />
            <strong className="route-status-time">{selected.minutes} min</strong>
          </div>
          <div className="route-cards">
            {destination.options.map((option) => {
              const active = option.mode === selected.mode;
              return <Link key={option.mode} to="/kartta" search={{ dest: destination.id, mode: option.mode }} className={`route-card ${active ? "is-active" : ""}`}>
                <div className="route-card-icon"><ModeIcon mode={option.mode} /></div>
                <div className="route-card-name">{option.mode === "walk" ? "KÄVELY" : option.mode === "bus" ? "BUSSI" : "KIMPPAKYYTI"}</div>
                <div className="route-card-time">{option.minutes}<span>min</span></div>
                <div className="route-card-price">{formatCost(option.cost)}</div>
                {active ? <span className="route-card-badge">HALVIN</span> : <span className="route-card-arrow"><ArrowUpRight className="size-4" /></span>}
              </Link>;
            })}
          </div>
          <Link to="/kartta" search={{ dest: destination.id, mode: selected.mode }} className="route-map-preview">
            <div className="route-map-grid" />
            <div className="route-map-water" />
            <div className="route-map-label route-map-label-city">ROVANIEMI</div>
            <div className="route-map-label route-map-label-river">Kemijoki</div>
            <div className="route-map-path"><span className="route-map-start"><Navigation className="size-4" /></span><span className="route-map-dots" /><span className="route-map-destination"><Map className="size-5" /></span></div>
            <span className="route-map-open">Avaa kartta <ArrowUpRight className="size-4" /></span>
          </Link>
        </section>

        <nav className="mt-5 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-panel p-1" aria-label="Etusivun välilehdet">
          <a href="#travel-view" className="min-w-max rounded-xl bg-signal px-4 py-2.5 font-display tracking-wide text-background">MATKAT</a>
          <a href="#nearby-services" className="min-w-max rounded-xl px-4 py-2.5 font-display tracking-wide text-fog transition-colors hover:bg-card hover:text-foreground">PALVELUT LÄHISTÖLLÄ</a>
        </nav>

        <div id="home-views" className="mt-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth lg:block">
          <section id="travel-view" className="min-w-full snap-start pr-1">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-fog">
                <span className="kbd text-[11px] tracking-[0.2em]">DESTINATION</span>
                <span className="h-px w-16 bg-border sm:w-32" />
              </div>
              <button type="button" onClick={() => document.getElementById("nearby-services")?.scrollIntoView({ behavior: "smooth", inline: "start" })} className="inline-flex items-center gap-2 rounded-full border border-aurora bg-card px-3 py-2 text-sm text-aurora transition-colors hover:bg-aurora hover:text-background"><Sparkles className="size-4" />Palvelut lähistöllä</button>
            </div>
          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-fog" />
            <input value={destinationQuery} onChange={(event) => setDestinationQuery(event.target.value)} placeholder="Hae määränpäätä, esimerkiksi Arktikum" aria-label="Hae määränpäätä" className="w-full rounded-2xl border border-border bg-panel py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-fog focus:border-signal" />
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-panel px-4 py-3">
            <span className="size-2.5 shrink-0 rounded-full bg-signal" />
            <span className="truncate font-display text-2xl tracking-wide sm:text-3xl">
              {destination.name}
            </span>
            <span className="kbd ml-auto shrink-0 text-[11px] tracking-widest text-fog">
              {destination.distanceKm.toFixed(1)} KM
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {filteredDestinations.map((d) => {
              const active = d.id === destination.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setDestinationId(d.id);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-signal bg-signal text-background"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
            {filteredDestinations.length === 0 ? <p className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-fog">Määränpäätä ei löytynyt. Kokeile toista hakusanaa.</p> : null}
          </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            <div className="flex items-center gap-2 text-fog">
              <span className="kbd text-[11px] tracking-[0.2em]">OPTIONS</span>
              <span className="h-px flex-1 bg-border" />
              <span className="kbd text-[11px] tracking-widest text-fog">
                {destination.options.length} ROUTES
              </span>
            </div>

            {destination.options.map((option, i) => {
              const isRecommended = option.mode === recommended;
              const isSelected = option.mode === selected.mode;
              return (
                <Link
                  key={option.mode}
                  to="/kartta"
                  search={{ dest: destination.id, mode: option.mode }}
                  className={`relative block w-full animate-rise rounded-2xl bg-card p-4 text-left transition-colors hover:border-signal hover:bg-accent sm:p-5 ${
                    isSelected ? "border-2 border-signal" : "border border-border"
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {isRecommended ? (
                    <span className="kbd absolute -top-3 right-4 rounded-full bg-signal px-3 py-1 text-[10px] tracking-[0.2em] text-background">
                      FASTEST
                    </span>
                  ) : null}
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl font-display text-lg ${
                        isSelected
                          ? "bg-signal text-background"
                          : "border border-border bg-panel text-foreground"
                      }`}
                    >
                      {option.badge}
                    </div>
                    <div className="min-w-0 leading-none">
                      <div className="truncate font-display text-lg tracking-wide">
                        {option.name}
                      </div>
                      <div className="kbd mt-1 truncate text-[11px] tracking-widest text-fog">
                        {option.note}
                      </div>
                    </div>
                    <div className="ml-auto shrink-0 text-right">
                      <div
                        className={`font-display text-4xl leading-none sm:text-5xl ${
                          isSelected ? "text-signal" : ""
                        }`}
                      >
                        {String(option.minutes).padStart(2, "0")}
                      </div>
                      <div className="kbd mt-1 text-[11px] tracking-widest text-fog">MIN</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="kbd text-[11px] tracking-widest text-fog">COST</span>
                    <span
                      className={`font-display text-2xl ${isSelected ? "text-signal" : ""}`}
                    >
                      {option.cost}
                    </span>
                  </div>
                  <div className="mt-3 text-right font-display text-sm tracking-wide text-signal">ESIKATSELE KARTALLA →</div>
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="animate-rise rounded-2xl border border-border bg-panel p-5 lg:sticky lg:top-5">
              <div className="flex items-center gap-2 text-fog">
                <span className="kbd text-[11px] tracking-[0.2em]">SELECTED</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal font-display text-xl text-background">
                  {selected.badge}
                </div>
                <div className="min-w-0 leading-none">
                  <div className="truncate font-display text-2xl tracking-wide">
                    {selected.name}
                  </div>
                  <div className="kbd mt-1 truncate text-[11px] tracking-widest text-fog">
                    {selected.note}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {selected.steps.map((step, i) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="size-3 shrink-0 rounded-full bg-signal" />
                      {i < selected.steps.length - 1 ? (
                        <span className="w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className={i < selected.steps.length - 1 ? "pb-4" : ""}>
                      <div className="font-medium">{step.title}</div>
                      <div className="kbd mt-0.5 text-[11px] tracking-widest text-fog">
                        {step.meta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/kartta" search={{ dest: destination.id, mode: selected.mode }} className="mt-6 block w-full rounded-xl bg-signal py-4 text-center font-display text-xl tracking-wide text-background transition-colors duration-200 hover:bg-foreground">
                PREVIEW ROUTE ON MAP
              </Link>
              <div className="kbd mt-3 text-center text-[11px] tracking-widest text-fog">
                EST. {selected.cost} · {selected.minutes} MIN
              </div>
            </div>
          </div>
        </div>
          </section>

        <section id="nearby-services" className="mt-8 min-w-full snap-start lg:mt-8">
          <div className="flex items-center gap-2 text-fog">
            <span className="kbd text-[11px] tracking-[0.2em]">NEARBY · WHILE YOU WAIT</span>
            <span className="h-px flex-1 bg-border" />
            <span className="kbd text-[10px] tracking-widest text-fog">SPONSORED</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {partners.map((p, i) => {
              const done = booked[p.id];
              return (
                <div
                  key={p.id}
                  className="relative animate-rise overflow-hidden rounded-2xl border border-border bg-card p-4 backdrop-blur"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-30 blur-2xl"
                    style={{ background: p.kind === "beauty" ? "var(--aurora-3)" : "var(--aurora-2)" }}
                  />
                  <div className="relative flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-panel text-xl">
                      {p.kind === "beauty" ? "✂" : "☕"}
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="truncate font-display text-lg tracking-wide">{p.name}</div>
                      <div className="kbd mt-0.5 truncate text-[10px] tracking-widest text-fog">{p.distance}</div>
                    </div>
                    {p.urgent ? (
                      <span className="kbd shrink-0 animate-pulse-dot rounded-full bg-amber px-2.5 py-1 text-[10px] tracking-widest text-background">
                        FREE IN {p.urgent}
                      </span>
                    ) : null}
                  </div>
                  <div className="relative mt-3 text-sm">{p.pitch}</div>
                  <div className="kbd relative text-[11px] tracking-widest text-aurora">{p.deal.toUpperCase()}</div>
                  <div className="relative mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                    <span className="font-display text-2xl">{p.price}</span>
                    <button
                      onClick={() => setBooked((b) => ({ ...b, [p.id]: true }))}
                      disabled={done}
                      className={`rounded-xl px-4 py-2.5 font-display text-base tracking-wide transition-colors ${
                        done ? "bg-panel text-aurora" : "bg-aurora text-background hover:bg-foreground"
                      }`}
                    >
                      {done ? (p.kind === "beauty" ? "✓ BOOKED" : "✓ ORDERED") : `${p.cta} · ${p.price}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        </div>

        <footer className="kbd mt-6 flex items-center justify-between gap-3 text-[10px] tracking-[0.2em] text-fog">
          <span className="truncate">CROSSING · ROVANIEMI · ARCTIC CIRCLE</span>
          <span className="shrink-0">UPDATED {time ?? "--:--"}</span>
        </footer>
      </div>
    </div>
  );
}
