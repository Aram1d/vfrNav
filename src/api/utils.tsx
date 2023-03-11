import { useDisclosure, useMediaQuery } from "@mantine/hooks";

// UI hooks

export const useSmallScreen = () => useMediaQuery("(max-width: 1100px)");
export const useAddEditDisclosure = () => {
  const [add, { close, open }] = useDisclosure(false);
  const [edit, { close: closeEdit, open: openEdit }] = useDisclosure(false);
  return {
    add,
    edit,
    close: () => {
      close();
      closeEdit();
    },
    openAdd: () => {
      closeEdit();
      open();
    },
    openEdit: () => {
      close();
      openEdit();
    },
  };
};

// Constants

const APP_PREFIX = "vfr-nav-";
export const FPL_PREFIX = `${APP_PREFIX}fpl-`;
export const getFplKey = (fplName: string) => FPL_PREFIX + fplName;
export const getFplName = (fplKey: string) => fplKey.replace(FPL_PREFIX, "");
export const DEFAULT_FPL = getFplKey("1");
export const SEL_FPL_KEY = `${APP_PREFIX}sel-fpl`;

export const getFplListKeys = () =>
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(FPL_PREFIX))
    .sort();

export const getFplListFromKeys = (keys: string[]) =>
  keys.map((k) => k.replace(new RegExp(FPL_PREFIX), ""));

export const getDefaultFplKey = (preLoadedkeys?: string[]) => {
  const keys = preLoadedkeys || getFplListKeys();
  const selected = localStorage.getItem(SEL_FPL_KEY);

  return keys.find((k) => k === selected) || keys[0] || DEFAULT_FPL;
};

export function nanifyEmptyString(number: number | "") {
  return number === "" ? NaN : number;
}

export function stringifyNaN(number: number) {
  return isNaN(number) ? "" : number;
}
