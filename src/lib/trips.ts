export type Mode = "walk" | "bus" | "ride";

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
  id: "CROSSING·04",
  name: "Market St & 5th",
};

export const destinations: Destination[] = [
  {
    id: "riverside",
    name: "Riverside Market",
    distanceKm: 1.2,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT",
        minutes: 14,
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Follow 5th along the river", meta: "1.2 KM" },
          { title: "Riverside Market", meta: "ARRIVE IN 14 MIN" },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: "BUS 12",
        note: "NEXT DEPARTS 18:47",
        minutes: 9,
        cost: "€2.40",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at north curb, 120 m", meta: "BOARD 18:47" },
          { title: "Riverside Market", meta: "2 STOPS · 9 MIN" },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: "SURGE ×1.3",
        minutes: 6,
        cost: "€4.80",
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 2", meta: "WAIT ~2 MIN" },
          { title: "Riverside Market", meta: "ARRIVE IN 6 MIN" },
        ],
      },
    ],
  },
  {
    id: "oldtown",
    name: "Old Town",
    distanceKm: 0.6,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT",
        minutes: 8,
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Cut through Mill Lane", meta: "0.6 KM" },
          { title: "Old Town", meta: "ARRIVE IN 8 MIN" },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: "BUS 3",
        note: "NEXT DEPARTS 18:51",
        minutes: 11,
        cost: "€2.40",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at east curb, 80 m", meta: "BOARD 18:51" },
          { title: "Old Town", meta: "1 STOP · 11 MIN" },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: "NO SURGE",
        minutes: 5,
        cost: "€3.60",
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 1", meta: "WAIT ~3 MIN" },
          { title: "Old Town", meta: "ARRIVE IN 5 MIN" },
        ],
      },
    ],
  },
  {
    id: "central",
    name: "Central Station",
    distanceKm: 2.4,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT",
        minutes: 29,
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "North along Market St", meta: "2.4 KM" },
          { title: "Central Station", meta: "ARRIVE IN 29 MIN" },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: "BUS 12",
        note: "NEXT DEPARTS 18:47",
        minutes: 13,
        cost: "€2.40",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at north curb, 120 m", meta: "BOARD 18:47" },
          { title: "Central Station", meta: "5 STOPS · 13 MIN" },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: "SURGE ×1.6",
        minutes: 10,
        cost: "€9.20",
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 2", meta: "WAIT ~4 MIN" },
          { title: "Central Station", meta: "ARRIVE IN 10 MIN" },
        ],
      },
    ],
  },
  {
    id: "harbor",
    name: "Harbor Pier",
    distanceKm: 1.8,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT",
        minutes: 22,
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Down the quay path", meta: "1.8 KM" },
          { title: "Harbor Pier", meta: "ARRIVE IN 22 MIN" },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: "BUS 7",
        note: "NEXT DEPARTS 18:55",
        minutes: 16,
        cost: "€2.40",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at south curb, 90 m", meta: "BOARD 18:55" },
          { title: "Harbor Pier", meta: "4 STOPS · 16 MIN" },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: "SURGE ×1.2",
        minutes: 8,
        cost: "€6.40",
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 2", meta: "WAIT ~2 MIN" },
          { title: "Harbor Pier", meta: "ARRIVE IN 8 MIN" },
        ],
      },
    ],
  },
  {
    id: "northgate",
    name: "North Gate",
    distanceKm: 3.1,
    options: [
      {
        mode: "walk",
        badge: "W",
        name: "WALK",
        note: "ON FOOT",
        minutes: 37,
        cost: "FREE",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "North along the ring road", meta: "3.1 KM" },
          { title: "North Gate", meta: "ARRIVE IN 37 MIN" },
        ],
      },
      {
        mode: "bus",
        badge: "B",
        name: "BUS 12",
        note: "NEXT DEPARTS 18:47",
        minutes: 18,
        cost: "€2.40",
        steps: [
          { title: "Cross here on green", meta: "START · NOW" },
          { title: "Stop at north curb, 120 m", meta: "BOARD 18:47" },
          { title: "North Gate", meta: "7 STOPS · 18 MIN" },
        ],
      },
      {
        mode: "ride",
        badge: "S",
        name: "SHARED RIDE",
        note: "SURGE ×1.1",
        minutes: 12,
        cost: "€10.60",
        steps: [
          { title: "Crossing 04", meta: "START · NOW" },
          { title: "Pickup at curb, bay 2", meta: "WAIT ~3 MIN" },
          { title: "North Gate", meta: "ARRIVE IN 12 MIN" },
        ],
      },
    ],
  },
];

export function fastest(options: Option[]): Mode {
  return options.reduce((a, b) => (b.minutes < a.minutes ? b : a)).mode;
}
