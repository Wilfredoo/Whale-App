import calculateMaxMinDeltaValues from "../helpers/calculateMaxMinLatLong.js";

const data = [
  [3.5169434, 213.417477, "wilfredo casas", "receiver"],
  [52.6169434, 14.917477, "wilfredo casas", "receiver"],
  [52.5095333, 53.2826181, "wilfredo casas", "receiver"],
  [52.5095679, 13.2826529, "wilfredo casas", "receiver"],
  [52.5175905, 23.4162168, "wilfredo casas", "receiver"],
  [152.5175905, 13.4162168, "wilfredo casas", "receiver"]
];

describe("Max Longitude and Latitude Test", () => {
  test("callcuate max and min values", () => {
    const result = calculateMaxMinDeltaValues(data);
    expect(result.maxLatitude).toBe(152.5175905);
    expect(result.maxLongitude).toBe(213.417477);

    expect(result.minLatitude).toBe(3.5169434);
    expect(result.minLongitude).toBe(13.2826529);
  });
});
