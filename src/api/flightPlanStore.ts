import create from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import {
  buildComputations,
  Computation,
  LegComputations,
} from "../ui/ComputationUtils";

export interface Leg {
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

const mkLeg = (): Leg => ({
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
  setAircraftCruiseSpeed: (registration: string) => void;

  departureAirfield: {
    icao: string;
  };
  setDepartureAirfieldIcao: (icaoCode: string) => void;
  setArrivalAirfieldIcao: (icaoCode: string) => void;

  arrivalAirfield: {
    icao: string;
  };
  date: string;
  setDate: (date: Date) => void;

  computation: Computation;
  legComputation: LegComputations;

  legs: Leg[];
  setLeg: <KeyofLeg extends keyof Leg>(
    index: number,
    dataType: KeyofLeg,
    value: Leg[KeyofLeg]
  ) => void;
  addLeg: () => void;
  removeLeg: () => void;
  setAlt: <TDataType extends keyof Leg["alt"]>(
    index: number,
    dataType: TDataType,
    value: Leg["alt"][TDataType]
  ) => void;
  setWind: <TDataType extends keyof Leg["wind"]>(
    index: number,
    dataType: TDataType,
    value: Leg["wind"][TDataType]
  ) => void;
}

export const useFplStore = create<FlightPlanStore>(
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
      setAircraftCruiseSpeed: (reg: string) =>
        set(
          produce((state) => {
            state.aircraft.cruiseSpeed = reg;
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
      setDate: (date) =>
        set(
          produce((state) => {
            console.log(date);
            state.date = date.toString();
          })
        ),

      ...buildComputations(get),

      legs: [],
      setLeg: (index, KeyofLeg, value) =>
        set(
          produce((state) => {
            const leg = state.legs[index] || mkLeg();
            leg[KeyofLeg] = value;
            state.legs[index] = leg;
          })
        ),
      addLeg: () =>
        set(
          produce((state) => {
            state.legs.push(mkLeg());
          })
        ),
      removeLeg: () =>
        set(
          produce((state) => {
            state.legs.pop();
          })
        ),
      setAlt: (index, datatype, value) =>
        set(
          produce((state) => {
            state.legs[index].alt[datatype] = value;
          })
        ),
      setWind: (index, dataType, value) => {
        set(
          produce((state) => {
            state.legs[index].wind[dataType] = value;
          })
        );
      },
    }),
    {
      name: `vfr-nav-flp-1`,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        computation: currentState.computation,
        legComputation: currentState.legComputation,
      }),
    }
  )
);
