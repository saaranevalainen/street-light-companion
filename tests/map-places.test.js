import { describe, expect, test } from "bun:test";
import { filterMapPlaces, mapPlaces, mapCategories } from "../src/lib/map-places";

describe("Rovaniemi map exploration", () => {
  test("all six requested categories have points", () => {
    for (const category of ["shared", "landmark", "bus", "scooter", "taxi", "service"]) {
      expect(filterMapPlaces(mapPlaces, [category], "").length).toBeGreaterThan(0);
      expect(filterMapPlaces(mapPlaces, [category], "").every((place) => place.category === category)).toBe(true);
    }
  });
  test("search matches a real landmark and respects category selection", () => {
    expect(filterMapPlaces(mapPlaces, mapCategories.map((c) => c.id), " ARKTIKUM ").map((p) => p.id)).toEqual(["arktikum"]);
    expect(filterMapPlaces(mapPlaces, ["scooter"], "Arktikum")).toEqual([]);
    expect(filterMapPlaces(mapPlaces, [], "")).toEqual([]);
  });
});