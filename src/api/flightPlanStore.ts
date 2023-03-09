import { create } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import { merge } from "lodash-es";
import {
  ComputedLegs,
  computeLegs,
  getBaseFactor,
} from "../ui/ComputationUtils";

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export interface Leg {
  name: string;
  alt: {
    desired: number;
    minimal: number;
  };
  magneticRoute: number;
  distance: number;
  wind: {
    direction: number;
    velocity: number;
  };
}

const mkLegState = (): Leg => ({
  name: "",
  alt: {
    desired: 0,
    minimal: 0,
  },
  magneticRoute: 0,
  distance: 0,
  wind: {
    direction: 0,
    velocity: 0,
  },
});

export interface FlightPlanStore {
  aircraft: {
    registration: string;
    cruiseSpeed: number;
  };
  setAircraftRegistration: (registration: string) => void;
  setAircraftCruiseSpeed: (speed: number) => void;

  departureAirfield: {
    icao: string;
  };
  setDepartureAirfieldIcao: (icaoCode: string) => void;
  setArrivalAirfieldIcao: (icaoCode: string) => void;

  arrivalAirfield: {
    icao: string;
  };
  date: string;
  getDate: () => Date;
  setDate: (date: Date) => void;

  getBaseFactor: () => number;
  computeLegs: () => ComputedLegs;

  legs: Leg[];
  legsHandlers: {
    append: (leg?: Leg) => void;
    prepend: (leg: Leg) => void;

    insert: (index: number, ...legs: Leg[]) => void;
    remove: (...indexes: number[]) => void;

    pop: () => void;
    shift: () => void;

    reorder: (ordering: { from: number; to: number }) => void;

    setLeg: (index: number, partialLeg: DeepPartial<Leg>) => void;
  };

  hideWind: boolean;
  toggleHideWind: () => void;
}

export type FplPersistantState = {
  state: Pick<
    FlightPlanStore,
    | "aircraft"
    | "departureAirfield"
    | "arrivalAirfield"
    | "date"
    | "legs"
    | "hideWind"
  >;
  version: number;
};

export const useFplStore = create<FlightPlanStore>()(
  persist(
    (set, get) => ({
      aircraft: {
        registration: "F-",
        cruiseSpeed: 0,
      },
      setAircraftRegistration: (reg: string) =>
        set(
          produce((state) => {
            state.aircraft.registration = reg;
          })
        ),
      setAircraftCruiseSpeed: (speed) =>
        set(
          produce((state) => {
            state.aircraft.cruiseSpeed = speed;
          })
        ),

      departureAirfield: {
        icao: "LF",
      },
      setDepartureAirfieldIcao: (icaoCode) =>
        set(
          produce((state) => {
            state.departureAirfield.icao = icaoCode;
          })
        ),

      arrivalAirfield: {
        icao: "LF",
      },
      setArrivalAirfieldIcao: (icaoCode) =>
        set(
          produce((state) => {
            state.arrivalAirfield.icao = icaoCode;
          })
        ),

      date: new Date().toString(),
      getDate: () => {
        const memoryDate = new Date(get().date);
        if (memoryDate.toString() === "Invalid Date") return new Date();
        return memoryDate;
      },
      setDate: (date) =>
        set(
          produce((state) => {
            state.date = date.toString();
          })
        ),

      getBaseFactor: () => getBaseFactor(get),
      computeLegs: () => computeLegs(get),

      legs: [mkLegState()],
      legsHandlers: {
        append: (leg) =>
          set(
            produce((state) => {
              state.legs = [...state.legs, leg || mkLegState()];
            })
          ),
        prepend: (leg) =>
          set(
            produce((state) => {
              state.legs = [leg || mkLegState(), ...state.legs];
            })
          ),

        insert: (index, ...legs) =>
          set(
            produce((state) => {
              state.legs = [
                ...state.legs.slice(0, index),
                ...legs,
                state.legs.slice(index),
              ];
            })
          ),
        remove: (...indexes) =>
          set(
            produce((state) => {
              state.legs = state.legs.filter(
                (_: Leg, index: number) => !indexes.includes(index)
              );
            })
          ),

        setLeg: (index, leg) =>
          set(
            produce((state) => {
              state.legs[index] = merge(state.legs[index], leg);
            })
          ),

        pop: () =>
          set(
            produce(({ legs }) => {
              legs.pop();
            })
          ),
        shift: () =>
          set(
            produce(({ legs }) => {
              legs.shift();
            })
          ),

        reorder: ({ from, to }) =>
          set(
            produce(({ legs }) => {
              const movingLeg = legs.splice(from, 1);

              legs.splice(to, 0, ...movingLeg);
            })
          ),
      },
      hideWind: false,
      toggleHideWind: () =>
        set(
          produce((state) => {
            state.hideWind = !state.hideWind;
          })
        ),
    }),
    {
      name: `vfr-nav-fpl-1`,
      partialize: (state) => {
        const {
          aircraft,
          departureAirfield,
          arrivalAirfield,
          date,
          legs,
          hideWind,
        } = state;
        return {
          aircraft,
          departureAirfield,
          arrivalAirfield,
          date,
          legs,
          hideWind,
        };
      },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Record<string, any>),
        legsHandlers: currentState.legsHandlers,
      }),
    }
  )
);
