import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { crossing, destinations, fastest, type Option } from "@/lib/trips";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crossing — walk, bus or ride, decided at the light" },
      {
        name: "description",
        content:
          "Standing at a pedestrian crossing? Compare time and price for walking, taking the bus or a shared ride before the signal changes.",
      },
      { property: "og:title", content: "Crossing — walk, bus or ride, decided at the light" },
      {
        property: "og:description",
        content:
          "Live time and price comparison for walking, bus and shared rides, shown right at the traffic light.",
      },
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

function Index() {
  const time = useClock();
  const { seconds, green } = useSignal();
  const [destinationId, setDestinationId] = useState(destinations[0]!.id);
  const [selectedMode, setSelectedMode] = useState<Option["mode"] | null>(null);

  const destination = useMemo(
    () => destinations.find((d) => d.id === destinationId) ?? destinations[0]!,
    [destinationId],
  );
  const recommended = fastest(destination.options);
  const selected =
    destination.options.find((o) => o.mode === (selectedMode ?? recommended)) ??
    destination.options[0]!;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-signal selection:text-background">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
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

        <div className="mt-5">
          <div className="flex items-center gap-2 text-fog">
            <span className="kbd text-[11px] tracking-[0.2em]">DESTINATION</span>
            <span className="h-px flex-1 bg-border" />
          </div>
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
            {destinations.map((d) => {
              const active = d.id === destination.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setDestinationId(d.id);
                    setSelectedMode(null);
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
          </div>
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
                <button
                  key={option.mode}
                  onClick={() => setSelectedMode(option.mode)}
                  className={`relative block w-full animate-rise rounded-2xl bg-card p-4 text-left sm:p-5 ${
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
                </button>
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

              <button className="mt-6 w-full rounded-xl bg-signal py-4 font-display text-xl tracking-wide text-background transition-colors duration-200 hover:bg-foreground">
                START THIS TRIP
              </button>
              <div className="kbd mt-3 text-center text-[11px] tracking-widest text-fog">
                EST. {selected.cost} · {selected.minutes} MIN
              </div>
            </div>
          </div>
        </div>

        <footer className="kbd mt-6 flex items-center justify-between gap-3 text-[10px] tracking-[0.2em] text-fog">
          <span className="truncate">CROSSING · URBAN TRANSIT</span>
          <span className="shrink-0">UPDATED {time ?? "--:--"}</span>
        </footer>
      </div>
    </div>
  );
}
