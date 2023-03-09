import * as React from "react";
import { useState } from "react";
import { FplHeader } from "./ui/FlightPlan/FplHeader";
import { FlightPlanTable } from "./ui/FlightPlan/FlightPlanTable";
import {
  MantineProvider,
  Container,
  ColorScheme,
  ColorSchemeProvider,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useLocalStorage } from "@mantine/hooks";

export const App = () => {
  const [usedFpl, setUsedFpl] = useState("fpl-1");
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "vfr-nav-theme",
    defaultValue: "dark",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  const theme = useMantineTheme();

  const isSmall = useMediaQuery("(max-width: 1000px)");
  const defaultComponentsSize = {
    defaultProps: {
      size: isSmall ? "xs" : "md",
    },
  };

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
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                  lg: "16px",
                  xl: "18px",
                },
              }
            : {}),
          components: {
            Input: defaultComponentsSize,
            TextInput: defaultComponentsSize,
            InputWrapper: defaultComponentsSize,
            NumberInput: defaultComponentsSize,
            Table: defaultComponentsSize,
            Button: defaultComponentsSize,
            Select: defaultComponentsSize,
            DatePicker: defaultComponentsSize,
            TimeInput: defaultComponentsSize,
            SegmentedControl: defaultComponentsSize,
            ActionIcon: defaultComponentsSize,
            Group: { defaultProps: { spacing: isSmall ? "xs" : "md" } },
            DateTimePicker: defaultComponentsSize,
          },
        }}
      >
        <Container
          sx={{ minHeight: "100vh", maxWidth: "1200px" }}
          p={isSmall ? theme.spacing.xs : theme.spacing.md}
        >
          <FplHeader usedFpl={usedFpl} setUsedFpl={setUsedFpl} />
          <FlightPlanTable />
        </Container>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
