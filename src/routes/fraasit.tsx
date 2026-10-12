import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const phrases = [
  { fi: "Missä on bussipysäkki?", en: "Where is the bus stop?", es: "¿Dónde está la parada de autobús?", ja: "バス停はどこですか？" },
  { fi: "Voitko auttaa minua?", en: "Can you help me?", es: "¿Puede ayudarme?", ja: "手伝ってもらえますか？" },
  { fi: "Kuinka paljon tämä maksaa?", en: "How much does this cost?", es: "¿Cuánto cuesta esto?", ja: "これはいくらですか？" },
  { fi: "Haluaisin mennä keskustaan.", en: "I would like to go to the city centre.", es: "Me gustaría ir al centro.", ja: "中心街に行きたいです。" },
  { fi: "Kiitos ja hyvää matkaa!", en: "Thank you and have a good trip!", es: "¡Gracias y buen viaje!", ja: "ありがとうございます。よい旅を！" },
];

export const Route = createFileRoute("/fraasit")({
  head: () => ({ meta: [{ title: "Rudolf — hyödylliset fraasit" }, { name: "description", content: "Hyödyllisiä matkailufraaseja suomeksi, englanniksi, espanjaksi ja japaniksi." }] }),
  component: PhrasesPage,
});

function PhrasesPage() {
  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-10">
    <header className="flex items-center justify-between gap-3 border-b border-border pb-4"><Link to="/" className="flex items-center gap-2 font-display text-xl text-signal"><span className="grid size-9 place-items-center rounded-md bg-signal text-background">R</span>RUDOLF</Link><Button asChild variant="outline"><Link to="/"><ArrowLeft />Etusivulle</Link></Button></header>
    <section className="mt-8"><div className="flex items-center gap-3 text-signal"><Languages className="size-7" /><p className="kbd text-xs tracking-[0.2em]">LANGUAGE TOOLKIT</p></div><h1 className="mt-3 font-display text-5xl">Hyödylliset fraasit</h1><p className="mt-3 max-w-2xl text-fog">Pidä nämä lauseet mukana, kun liikut Rovaniemellä. Ääntämys ja käännökset ovat suuntaa antavia.</p>
      <div className="mt-7 grid gap-3">{phrases.map((phrase) => <article key={phrase.fi} className="rounded-2xl border border-border bg-panel p-5"><h2 className="font-display text-2xl text-signal">{phrase.fi}</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><span className="kbd text-[10px] tracking-widest text-fog">ENGLISH</span><p className="mt-1">{phrase.en}</p></div><div><span className="kbd text-[10px] tracking-widest text-fog">ESPAÑOL</span><p className="mt-1">{phrase.es}</p></div><div><span className="kbd text-[10px] tracking-widest text-fog">日本語</span><p className="mt-1">{phrase.ja}</p></div></div></article>)}</div>
    </section>
  </div></main>;
}
