import { describe, expect, test } from "bun:test";
import { filterMapPlaces, mapPlaces, mapCategories } from "../src/lib/map-places";

describe("Rovaniemi map exploration", () => {
  test("all six requested categories have points", () => {
    for (const category of ["shared", "landmark", "bus", "scooter", "taxi", "service"]) {
      expect(filterMapPlaces(mapPlaces, [category], "").length).toBeGreaterThan(0);
      expect(filterMapPlaces(mapPlaces, [category], "").every((place) => place.category === category)).toBe(true);
    }
  });
  test("large-screen spots are exactly the tourist-heavy landmarks", () => {
    expect(filterMapPlaces(mapPlaces, mapCategories.map((c) => c.id), "", true).map((p) => p.id).sort()).toEqual(["airport", "arktikum", "santa", "station"]);
    expect(filterMapPlaces(mapPlaces, ["bus"], "", true)).toEqual([]);
    expect(filterMapPlaces(mapPlaces, mapCategories.map((c) => c.id), "lentoasema", true).map((p) => p.id)).toEqual(["airport"]);
    expect(filterMapPlaces(mapPlaces, mapCategories.map((c) => c.id), "taxi-center", true)).toEqual([]);
  });
  test("search matches a real landmark and respects category selection", () => {
    expect(filterMapPlaces(mapPlaces, mapCategories.map((c) => c.id), " ARKTIKUM ").map((p) => p.id)).toEqual(["arktikum"]);
    expect(filterMapPlaces(mapPlaces, ["scooter"], "Arktikum")).toEqual([]);
    expect(filterMapPlaces(mapPlaces, [], "")).toEqual([]);
  });
});