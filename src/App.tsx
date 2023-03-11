import * as React from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FplHeader } from "./ui/FlightPlan/FplHeader";
import { FlightPlanTable } from "./ui/FlightPlan/FlightPlanTable";
import { useSmallScreen } from "./api/utils";

export const App = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "vfr-nav-theme",
    defaultValue: "dark",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  const theme = useMantineTheme();

  const isSmall = useSmallScreen();
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
            Group: { defaultProps: { spacing: isSmall ? "xs" : "md" } },
            DateTimePicker: defaultComponentsSize,
          },
        }}
      >
        <Container
          sx={{ minHeight: "100vh", width: "100vw", maxWidth: "100rem" }}
          py={isSmall ? theme.spacing.xs : theme.spacing.md}
          px={0}
        >
          <FplHeader />
          <FlightPlanTable />
        </Container>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
