import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Landmark, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const places = [
  { name: "Arktikum", type: "Museo ja tiedekeskus", text: "Ounasjoen rannalla sijaitseva paikka kertoo Lapin luonnosta, historiasta ja pohjoisista kulttuureista." },
  { name: "Joulupukin Pajakylä", type: "Napapiirin nähtävyys", text: "Napapiirillä sijaitseva matkailukohde, jossa voi tavata joulupukin ja lähettää kortin Napapiirin postileimalla." },
  { name: "Ounasvaara", type: "Luonto ja näkymät", text: "Kaupunkia ympäröivä vaara tarjoaa ulkoilureittejä, hiihtoa ja laajan näkymän Rovaniemen yli." },
  { name: "Jätkänkynttilä", type: "Rovaniemen maamerkki", text: "Kemijoen ylittävä valaistu silta on yksi kaupungin tunnetuimmista näkymistä, erityisesti iltaisin." },
];

export const Route = createFileRoute("/nahtavyydet")({
  head: () => ({ meta: [{ title: "Rudolf — nähtävyydet ja perinteet" }, { name: "description", content: "Rovaniemen nähtävyyksiä, luontoa ja paikallisia perinteitä." }] }),
  component: AttractionsPage,
});

function AttractionsPage() {
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-10">
    <header className="flex items-center justify-between gap-3 border-b border-border pb-4"><Link to="/" className="flex items-center gap-2 font-display text-xl text-signal"><span className="grid size-9 place-items-center rounded-md bg-signal text-background">R</span>RUDOLF</Link><Button asChild variant="outline"><Link to="/"><ArrowLeft />Etusivulle</Link></Button></header>
    <section className="mt-8"><div className="flex items-center gap-3 text-signal"><Landmark className="size-7" /><p className="kbd text-xs tracking-[0.2em]">VISIT ROVANIEMI</p></div><h1 className="mt-3 font-display text-5xl">Nähtävyydet ja perinteet</h1><p className="mt-3 max-w-2xl text-fog">Koe Rovaniemen jokimaisemat, arktinen luonto ja Lapin tarinat rauhassa.</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">{places.map((place) => <article key={place.name} className="rounded-2xl border border-border bg-panel p-5"><MapPin className="size-5 text-signal" /><p className="mt-4 kbd text-[10px] tracking-widest text-aurora">{place.type}</p><h2 className="mt-2 font-display text-2xl">{place.name}</h2><p className="mt-3 text-sm leading-relaxed text-fog">{place.text}</p></article>)}</div>
      <article className="mt-4 rounded-2xl border border-signal bg-accent p-5"><h2 className="font-display text-2xl">Paikallisia tapoja</h2><ul className="mt-3 grid gap-3 text-sm text-fog sm:grid-cols-3"><li>Sauna kuuluu monen paikallisen palautumishetkeen.</li><li>Poronliha, marjat ja ruis ovat Lapin ruokaperinteessä tärkeitä.</li><li>Revontulia kannattaa katsoa pimeältä paikalta kaupungin ulkopuolella.</li></ul></article>
      <Button asChild className="mt-5"><Link to="/kartta">Avaa nähtävyydet kartalla</Link></Button>
    </section>
  </div></main>;
}
