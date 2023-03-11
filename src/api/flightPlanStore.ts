import { create } from "zustand";
import produce from "immer";
import { persist } from "zustand/middleware";
import { merge } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { ComputedLegs, computeLegs, getBaseFactor } from "./computationUtils";
import {
  FPL_PREFIX,
  getDefaultFplKey,
  getFplKey,
  getFplListKeys,
  SEL_FPL_KEY,
} from "./utils";
import { fplValidatorV0 } from "./flightPlanValidationSchema";

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export interface Leg {
  name: string;
  id: string;
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
  id: uuidv4(),
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
      name: getDefaultFplKey(),
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
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          const verifiedState = fplValidatorV0(persistedState)
            ? (persistedState as any as FlightPlanStore)
            : null;

          if (!verifiedState) throw new Error("Données corrompues");

          verifiedState.legs = verifiedState.legs.map((leg) => ({
            ...leg,
            id: uuidv4(),
          }));
          return verifiedState as any;
        }
      },
    }
  )
);

// FPL Key store

interface FplKeyStore {
  selectedFplKey: string;
  fplList: { value: string; label: string }[];
  loadFpl: (fplKey: string) => void;
  addFpl: (name: string) => void;
  editFpl: (newName: string) => void;
  deleteFpl: () => void;
}

export const useFplKeyStore = create<FplKeyStore>()((set, get) => {
  function mapToSelectOption(keys: string[]) {
    return keys.map((value) => ({
      value,
      label: value.replace(new RegExp(FPL_PREFIX), ""),
    }));
  }

  const fplKeysList = getFplListKeys();
  return {
    selectedFplKey: getDefaultFplKey(fplKeysList),
    fplList: mapToSelectOption(fplKeysList),

    loadFpl: (fplKey: string) => {
      useFplStore.persist.setOptions({
        name: fplKey,
      });
      useFplStore.persist.rehydrate();
      set((state) => ({ ...state, selectedFplKey: fplKey }));
      window.localStorage.setItem(SEL_FPL_KEY, fplKey);
    },

    addFpl: (name) => {
      const fplKey = getFplKey(name);
      get().loadFpl(fplKey);

      set((state) => ({
        ...state,
        selectedFplKey: fplKey,
        fplList: mapToSelectOption(getFplListKeys()),
      }));
    },
    editFpl(newName: string) {
      const actualKey = useFplStore.persist.getOptions().name as string;
      get().loadFpl(getFplKey(newName));
      window.localStorage.removeItem(actualKey);
      set((state) => ({
        ...state,
        fplList: mapToSelectOption(getFplListKeys()),
      }));
    },

    deleteFpl: () => {
      const actualName = useFplStore.persist.getOptions().name as string;
      const newLoadedFplKey = getFplListKeys().filter(
        (fpl) => fpl !== getFplKey(actualName)
      )[0];
      window.localStorage.removeItem(actualName);
      get().loadFpl(newLoadedFplKey);
      set((state) => ({
        ...state,
        fplList: mapToSelectOption(getFplListKeys()),
      }));
    },
  };
});
