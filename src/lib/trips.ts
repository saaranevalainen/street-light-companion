export type Mode = "walk" | "bus" | "ride" | "taxi";

export type Option = {
  mode: Mode;
  badge: string;
  name: string;
  note: string;
  minutes: number;
  cost: string;
  steps: { title: string; meta: string }[];
};

export type Destination = {
  id: string;
  name: string;
  distanceKm: number;
  options: Option[];
};

export const crossing = {
  id: "ROVANIEMI·04",
  name: "Koskikatu & Rovakatu",
};

function dest(
  id: string,
  name: string,
  km: number,
  walk: [number, string],
  bus: [string, string, number, string],
  ride: [string, number, string, string],
  taxi: [number, string],
): Destination {
  return {
    id,
    name,
    distanceKm: km,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT · MIND THE ICE",
        minutes: walk[0],
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: walk[1], meta: `${km.toFixed(1)} KM` },
          { title: name, meta: `ARRIVE IN ${walk[0]} MIN` },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: `LINKKARI ${bus[0]}`,
        note: `NEXT DEPARTS ${bus[1]}`,
        minutes: bus[2],
        cost: "€3.50",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at Koskikatu, 100 m", meta: `BOARD ${bus[1]}` },
          { title: name, meta: `${bus[3]} · ${bus[2]} MIN` },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: ride[0],
        minutes: ride[1],
        cost: ride[2],
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 1", meta: ride[3] },
          { title: name, meta: `ARRIVE IN ${ride[1]} MIN` },
        ],
      },
      {
        mode: "taxi",
        badge: "T",
        name: "TAXI",
        note: "EXAMPLE PICKUP POINT",
        minutes: taxi[0],
        cost: taxi[1],
        steps: [
          { title: "Order or take a taxi", meta: "START · NOW" },
          { title: "Pickup at taxi point", meta: "ESTIMATED WAIT" },
          { title: name, meta: `ARRIVE IN ${taxi[0]} MIN` },
        ],
      },
    ],
  };
}

export const destinations: Destination[] = [
  dest("santa", "Santa Claus Village", 8.0, [95, "North along Jätkänkynttilä bridge & Route 4"], ["8", "21:14", 22, "12 STOPS"], ["NO SURGE", 12, "€19.80", "WAIT ~3 MIN"], [14, "€28"]),
  dest("arktikum", "Arktikum", 1.1, [13, "Along Pohjoisranta riverside"], ["3", "21:12", 7, "3 STOPS"], ["NO SURGE", 4, "€8.40", "WAIT ~2 MIN"], [5, "€12"]),
  dest("station", "Railway Station", 1.4, [17, "West on Koskikatu, Ratakatu"], ["1", "21:10", 6, "4 STOPS"], ["SURGE ×1.2", 5, "€9.60", "WAIT ~2 MIN"], [6, "€14"]),
  dest("ounasvaara", "Ounasvaara Ski Hill", 3.2, [40, "Over Jätkänkynttilä bridge, uphill trail"], ["4", "21:18", 14, "7 STOPS"], ["NO SURGE", 8, "€13.20", "WAIT ~4 MIN"], [9, "€18"]),
  dest("airport", "Rovaniemi Airport", 9.5, [115, "North via Lentokentäntie"], ["8", "21:14", 25, "14 STOPS"], ["SURGE ×1.3", 14, "€24.50", "WAIT ~3 MIN"], [16, "€32"]),
];

export function fastest(options: Option[]): Mode {
  return options.reduce((a, b) => (b.minutes < a.minutes ? b : a)).mode;
}
