import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { destinations, type Mode } from "@/lib/trips";
import { modeLabels } from "@/lib/route-preview";

type Search = { dest?: string; mode?: Mode };

export const Route = createFileRoute("/maksu")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    dest: typeof search["dest"] === "string" ? search["dest"] : undefined,
    mode: search["mode"] === "walk" || search["mode"] === "bus" || search["mode"] === "ride" ? search["mode"] : undefined,
  }),
  head: () => ({ meta: [{ title: "Maksu — Crossing" }, { name: "description", content: "Vahvista reittisi Crossing-palvelussa." }] }),
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
          <Link to="/" className="flex items-center gap-2 font-display text-xl text-signal"><span className="grid size-9 place-items-center rounded-md bg-signal text-background">C</span>CROSSING</Link>
          <Button asChild variant="outline"><Link to="/kartta" search={{ dest: destination.id, mode }}><ArrowLeft />Takaisin kartalle</Link></Button>
        </header>

        <section className="mt-8 rounded-3xl border border-border bg-panel p-5 sm:p-8">
          {paid ? <div className="py-10 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-signal text-background"><Check className="size-8" /></div><h1 className="mt-5 font-display text-4xl">MATKA VAHVISTETTU</h1><p className="mt-3 text-fog">{option.name} matkalle kohteeseen {destination.name} on varattu.</p><Button asChild className="mt-7"><Link to="/">Takaisin etusivulle</Link></Button></div> : <>
            <p className="kbd text-xs tracking-[0.2em] text-aurora">REITIN VAHVISTUS</p>
            <h1 className="mt-2 font-display text-4xl">Vahvista matkasi</h1>
            <div className="mt-7 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4"><div><p className="font-display text-2xl">{destination.name}</p><p className="mt-1 text-sm text-fog">{modeLabels[option.mode]} · {option.minutes} min</p></div><p className="font-display text-2xl text-signal">{option.cost}</p></div>
              <div className="mt-4 border-t border-border pt-4 text-sm text-fog">Lähtö: Koskikatu &amp; Rovakatu · Reitti tarkistettu juuri nyt</div>
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
