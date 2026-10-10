export type PlaceCategory = "shared" | "landmark" | "bus" | "scooter" | "taxi" | "service";
export type MapPlace = {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  address: string;
  description: string;
  sample?: boolean;
  /** Paikka, jossa on suuret näytöt ja paljon uusia käyttäjiä (turistikohteet yms.). */
  bigScreens?: boolean;
};

export const mapCategories: { id: PlaceCategory; label: string; symbol: string }[] = [
  { id: "shared", label: "Kimppakyydit", symbol: "↗" },
  { id: "landmark", label: "Tärkeät paikat", symbol: "★" },
  { id: "bus", label: "Bussipysäkit", symbol: "B" },
  { id: "scooter", label: "Potkulaudat", symbol: "S" },
  { id: "taxi", label: "Taksit", symbol: "T" },
  { id: "service", label: "Palvelut", symbol: "☕" },
];

// Landmark positions are approximate. All mobility/service points below are clearly labelled examples,
// not verified stops, rental locations, businesses or live inventory.
export const mapPlaces: MapPlace[] = [
  { id: "arktikum", name: "Arktikum", category: "landmark", lat: 66.5086, lng: 25.7265, address: "Pohjoisranta 4", description: "Tiedekeskus ja museo Ounasjoen rannalla. Sijainti on suuntaa antava.", bigScreens: true },
  { id: "station", name: "Rovaniemen rautatieasema", category: "landmark", lat: 66.4974, lng: 25.7055, address: "Ratakatu 3", description: "Rovaniemen rautatieasema. Sijainti on suuntaa antava.", bigScreens: true },
  { id: "santa", name: "Joulupukin Pajakylä", category: "landmark", lat: 66.5436, lng: 25.8472, address: "Napapiiri", description: "Joulupukin Pajakylä Napapiirillä, keskustasta koilliseen. Sijainti on suuntaa antava.", bigScreens: true },
  { id: "airport", name: "Rovaniemen lentoasema", category: "landmark", lat: 66.563, lng: 25.8307, address: "Lentokentäntie", description: "Rovaniemen lentoasema. Sijainti on suuntaa antava.", bigScreens: true },
  { id: "bus-ruokasenpuisto", name: "Ruokasenpuisto", category: "bus", lat: 66.4998, lng: 25.7314, address: "Ruokasenpuisto, keskusta", description: "Paikallisliikenteen keskeinen pysäkkialue. Sijainti on suuntaa antava; tarkista pysäkkikohtaiset linjat ja ajat Linkkarin reittioppaasta." },
  { id: "shared-center", name: "Keskustan kimppakyytipiste", category: "shared", lat: 66.5023, lng: 25.7298, address: "Koskikatu / Rovakatu", description: "Esimerkki kimppakyytien noutopisteestä. Noutopaikkaa tai saatavilla olevia kyytejä ei ole vahvistettu.", sample: true },
  { id: "shared-station", name: "Aseman kimppakyytipiste", category: "shared", lat: 66.4978, lng: 25.7063, address: "Rautatieaseman lähistö", description: "Esimerkkipiste jatkoyhteyksille. Ei varattavia kyytejä eikä vahvistettua noutopaikkaa.", sample: true },
  { id: "bus-center", name: "Koskikadun bussipysäkki", category: "bus", lat: 66.5026, lng: 25.7268, address: "Koskikadun lähistö", description: "Esimerkki keskustan pysäkkipisteestä. Tarkista oikea pysäkki, linjat ja lähtöajat Linkkarin reittioppaasta.", sample: true },
  { id: "bus-station", name: "Aseman bussiyhteydet", category: "bus", lat: 66.4981, lng: 25.709, address: "Rautatieaseman lähistö", description: "Esimerkkipiste bussiyhteyksille. Pysäkin sijaintia tai aikatauluja ei ole vahvistettu.", sample: true },
  { id: "scooter-center", name: "Keskustan potkulautapiste", category: "scooter", lat: 66.5011, lng: 25.7306, address: "Lordi-aukion lähistö", description: "Esimerkki vuokrauspisteestä. Saatavuutta, toimijaa tai pysäköintialuetta ei ole vahvistettu. Vuokraus ei ole käytössä.", sample: true },
  { id: "scooter-river", name: "Rannan potkulautapiste", category: "scooter", lat: 66.5032, lng: 25.738, address: "Kemijoen rannan lähistö", description: "Esimerkki potkulautojen vuokrauspisteestä. Ei reaaliaikaista kalusto- tai kausitietoa.", sample: true },
  { id: "taxi-center", name: "Keskustan taksipiste", category: "taxi", lat: 66.5017, lng: 25.7327, address: "Keskustan lähistö", description: "Esimerkki taksien noutopisteestä. Taksiasemaa ja autojen saatavuutta ei ole vahvistettu.", sample: true },
  { id: "taxi-station", name: "Aseman taksipiste", category: "taxi", lat: 66.4971, lng: 25.7068, address: "Rautatieaseman lähistö", description: "Esimerkki aseman taksipisteestä. Ei reaaliaikaista saatavuutta tai taksin tilausta.", sample: true },
  { id: "cafe", name: "Kahvila Poro & Pulla", category: "service", lat: 66.5017, lng: 25.7286, address: "Rovakadun lähistö", description: "Kuvitteellinen kahvilamainos: kauralatte ja korvapuusti. Yritys, tarjous ja sijainti ovat esimerkkejä.", sample: true },
  { id: "salon", name: "Salonki Revontuli", category: "service", lat: 66.5031, lng: 25.7288, address: "Koskikadun lähistö", description: "Kuvitteellinen kampaamomainos. Yritystä, sijaintia ja vapaita aikoja ei ole vahvistettu. Ei oikeaa ajanvarausta.", sample: true },
];

export function filterMapPlaces(places: MapPlace[], categories: PlaceCategory[], query: string, onlyScreens = false) {
  const search = query.trim().toLocaleLowerCase("fi");
  return places.filter((place) => categories.includes(place.category) && (!onlyScreens || place.bigScreens === true) && `${place.name} ${place.address}`.toLocaleLowerCase("fi").includes(search));
}