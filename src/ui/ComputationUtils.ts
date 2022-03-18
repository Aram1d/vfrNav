import { GetState } from "zustand";
import { FlightPlanStore } from "../api/flightPlanStore";

export const buildComputations = (get: GetState<FlightPlanStore>) => ({
  computation: {
    baseFactor: () => 60 / get()?.aircraft?.cruiseSpeed,
  },
  legComputation: (legIndex: number) => {
    const baseFactor = get().computation.baseFactor();
    const leg = get().legs[legIndex];

    const legMaxDrift = leg.wind.velocity * baseFactor;

    return {
      magneticCourse: () =>
        wDecimalRound(
          leg.magneticRoute +
            Math.sin(
              (leg.wind.direction - leg.magneticRoute) * (Math.PI / 180)
            ) *
              legMaxDrift
        ),
      duration: () => wDecimalRound(baseFactor * leg.distance),
      correctedDuration: () => {
        const tsv = baseFactor * leg.distance;
        const tc =
          baseFactor *
          leg.wind.velocity *
          Math.cos((leg.magneticRoute - leg.wind.direction) * (Math.PI / 180));

        return wDecimalRound(tsv * (tc / 60 + 1));
      },
      endHour: () => {
        return null;
      },
    };
  },
});

export type Computations = ReturnType<typeof buildComputations>;
export type Computation = Computations["computation"];
export type LegComputations = Computations["legComputation"];

export function wDecimalRound(value: number, nbOfdec = 2) {
  return Math.round(10 ** nbOfdec * value) / 10 ** nbOfdec;
}
