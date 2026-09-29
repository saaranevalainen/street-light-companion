export type Partner = {
  id: string;
  kind: "coffee" | "beauty";
  name: string;
  distance: string;
  pitch: string;
  deal: string;
  price: string;
  cta: string;
  urgent?: string;
};

// Sample advertiser listings — replace with real partner businesses.
export const partners: Partner[] = [
  { id: "p1", kind: "beauty", name: "Salonki Revontuli", distance: "90 M · KOSKIKATU", pitch: "Men's & women's haircut", deal: "Free chair in 15 min", price: "€32", cta: "BOOK SLOT", urgent: "15 MIN" },
  { id: "p2", kind: "coffee", name: "Kahvila Poro & Pulla", distance: "60 M · ROVAKATU", pitch: "Oat latte + korvapuusti", deal: "Ready when you cross", price: "€6.90", cta: "ORDER AHEAD" },
  { id: "p3", kind: "beauty", name: "Lumi Nails & Brows", distance: "180 M · LAPINKÄVIJÄNTIE", pitch: "Express manicure", deal: "Walk-in at 21:30", price: "€25", cta: "BOOK SLOT", urgent: "20 MIN" },
  { id: "p4", kind: "coffee", name: "Arctic Roastery", distance: "220 M · KOSKIKATU", pitch: "Hot lingonberry drink", deal: "-20% for crossers", price: "€3.60", cta: "ORDER AHEAD" },
];
