import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CreditCard, MapPinned, Navigation, Route as RouteIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { destinations, type Mode } from "@/lib/trips";
import { modeLabels } from "@/lib/route-preview";

type Search = { dest?: string; mode?: Mode };

export const Route = createFileRoute("/maksu")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    dest: typeof search["dest"] === "string" ? search["dest"] : undefined,
    mode: search["mode"] === "walk" || search["mode"] === "bus" || search["mode"] === "ride" || search["mode"] === "taxi" ? search["mode"] : undefined,
  }),
  head: () => ({ meta: [{ title: "Rudolf — reitin esikatselu ja maksu" }, { name: "description", content: "Esikatsele reitti, lue kyytiinotto-ohjeet ja vahvista matkasi Rudolfissa." }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const search = Route.useSearch();
  const [paid, setPaid] = useState(false);
  const destination = destinations.find((item) => item.id === search.dest) ?? destinations[0]!;
  const mode = search.mode ?? "ride";
  const option = destination.options.find((item) => item.mode === mode) ?? destination.options[0]!;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-10">
        <header className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl text-signal"><span className="grid size-9 place-items-center rounded-md bg-signal text-background">R</span>RUDOLF</Link>
          <Button asChild variant="outline"><Link to="/"><ArrowLeft />Etusivulle</Link></Button>
        </header>

        <section className="mt-6 rounded-3xl border border-border bg-panel p-5 sm:p-8">
          {paid ? <div className="py-10 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-signal text-background"><Check className="size-8" /></div><h1 className="mt-5 font-display text-4xl">MATKA VAHVISTETTU</h1><p className="mt-3 text-fog">{option.name} matkalle kohteeseen {destination.name} on varattu.</p><Button asChild className="mt-7"><Link to="/">Takaisin etusivulle</Link></Button></div> : <>
            <p className="kbd text-xs tracking-[0.2em] text-aurora">ESIKATSELU · OHJEET · MAKSU</p>
            <h1 className="mt-2 font-display text-4xl">{destination.name}</h1>
            <p className="mt-2 text-fog">{modeLabels[option.mode]} · {option.minutes} min · {option.cost}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-signal bg-accent p-4"><RouteIcon className="size-5 text-signal" /><strong className="mt-3 block">Reitti</strong><span className="mt-1 block text-sm text-fog">Esikatselu valmis</span></div>
              <div className="rounded-2xl border border-border bg-card p-4"><Navigation className="size-5 text-signal" /><strong className="mt-3 block">Kyytiin</strong><span className="mt-1 block text-sm text-fog">Koskikatu &amp; Rovakatu</span></div>
              <div className="rounded-2xl border border-border bg-card p-4"><CreditCard className="size-5 text-signal" /><strong className="mt-3 block">Hinta</strong><span className="mt-1 block text-sm text-fog">Esittelytila</span></div>
            </div>

            <Link to="/kartta" search={{ dest: destination.id, mode: option.mode }} className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-background/50 p-4 transition-colors hover:border-signal hover:bg-accent"><span><strong className="block font-display text-xl">Katso reitti kartalla</strong><span className="text-sm text-fog">Näet lähtöpisteen, määränpään ja reittiviivan</span></span><MapPinned className="size-6 text-signal" /></Link>

            <div className="mt-5 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-2xl">Mistä kyytiin?</h2>
              <div className="mt-4 space-y-4">
                {option.steps.map((step, index) => <div key={`${step.title}-${index}`} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-signal text-sm font-bold text-background">{index + 1}</span><div><strong className="block">{step.title}</strong><span className="text-sm text-fog">{step.meta}</span></div></div>)}
              </div>
              <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-fog">Tarkista aina kuljettajan, bussin tai noutopaikan tiedot paikan päällä. Reitti- ja saatavuustiedot ovat tässä näkymässä esimerkkejä.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background/30 p-4"><p className="font-medium">Maksutapa</p><button type="button" className="mt-3 flex w-full items-center gap-3 rounded-xl border border-signal bg-accent px-4 py-3 text-left"><CreditCard className="size-5 text-signal" /><span><span className="block text-sm">Korttimaksu</span><span className="block text-xs text-fog">Turvallinen maksun vahvistus</span></span><Check className="ml-auto size-5 text-signal" /></button></div>
            <Button className="mt-7 w-full py-6 text-lg" onClick={() => setPaid(true)}>Vahvista maksu · {option.cost}</Button>
            <p className="mt-3 text-center text-xs text-fog">Esittelytila: maksua ei veloiteta.</p>
          </>}
        </section>
      </div>
    </main>
  );
}
