import { GetState } from "zustand";
import { FlightPlanStore } from "../api/flightPlanStore";
import dayjs from "dayjs";

export const getBaseFactor = (get: GetState<FlightPlanStore>) =>
  60 / get()?.aircraft?.cruiseSpeed;

export const computeLegs = (get: GetState<FlightPlanStore>) => {
  const baseFactor = 60 / get().aircraft.cruiseSpeed;
  const startDate = dayjs(get().date);
  let cumulatedTimeToWaypoint = 0;

  return get()
    .legs.map((leg) => {
      const legMaxDrift = leg.wind.velocity * baseFactor;
      const duration = baseFactor * leg.distance;
      const correctedDuration =
        baseFactor *
        leg.wind.velocity *
        Math.cos((leg.magneticRoute - leg.wind.direction) * (Math.PI / 180));
      return {
        ...leg,
        magneticCourse: wDecimalRound(
          leg.magneticRoute +
            Math.sin(
              (leg.wind.direction - leg.magneticRoute) * (Math.PI / 180)
            ) *
              legMaxDrift
        ),
        duration: wDecimalRound(duration),
        correctedDuration: wDecimalRound(
          duration * (correctedDuration / 60 + 1)
        ),
      };
    })
    .map((leg) => {
      cumulatedTimeToWaypoint = cumulatedTimeToWaypoint + leg.correctedDuration;
      return {
        ...leg,
        reachDate: startDate.add(cumulatedTimeToWaypoint, "minutes"),
        cumulatedTimeToWPT: cumulatedTimeToWaypoint,
      };
    });
};

/*export const buildComputations = (get: GetState<FlightPlanStore>) => ({
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
});*/

export type ComputedLegs = ReturnType<typeof computeLegs>;

//export type Computations = ReturnType<typeof buildComputations>;
//export type Computation = Computations["computation"];
//export type LegComputations = Computations["legComputation"];

export function wDecimalRound(value: number, nbOfdec = 2) {
  return Math.round(10 ** nbOfdec * value) / 10 ** nbOfdec;
}
