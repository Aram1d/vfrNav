import * as React from "react";
import { useState } from "react";
import { FplHeader } from "./ui/FlightPlan/FplHeader";
import { FlightPlanTable } from "./ui/FlightPlan/FlightPlanTable";
import {
  MantineProvider,
  Container,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { useMediaQuery, useLocalStorage } from "@mantine/hooks";

export const App = () => {
  const [usedFpl, setUsedFpl] = useState("fpl-1");
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "vfr-nav-theme",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  const isSmall = useMediaQuery("(max-width: 1000px)");

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          ...(isSmall
            ? {
                fontSizes: {
                  xs: 10,
                  sm: 12,
                  md: 14,
                  lg: 16,
                  xl: 18,
                },
              }
            : {}),
        }}
        defaultProps={{
          Input: { size: isSmall ? "xs" : "md" },
          NumberInput: { size: isSmall ? "xs" : "md" },
          Table: { size: isSmall ? "xs" : "md" },
          Button: { size: isSmall ? "xs" : "md" },
          Select: { size: isSmall ? "xs" : "md" },
          DatePicker: { size: isSmall ? "xs" : "md" },
          TimeInput: { size: isSmall ? "xs" : "md" },
          SegmentedControl: { size: isSmall ? "xs" : "md" },
          ActionIcon: { size: isSmall ? "xs" : "md" },
          Group: { spacing: isSmall ? "xs" : "md" },
        }}
      >
        <Container sx={{ minHeight: "100vh", maxWidth: "1200px" }} p={3}>
          <FplHeader usedFpl={usedFpl} setUsedFpl={setUsedFpl} />
          <FlightPlanTable />
        </Container>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
