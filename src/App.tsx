import * as React from "react";
import { useState } from "react";
import { FplHeader } from "./ui/FlightPlan/FplHeader";
import { FlightPlanTable } from "./ui/FlightPlan/FlightPlanTable";
import { Box, ChakraProvider, theme } from "@chakra-ui/react";

export const App = () => {
  const [usedFpl, setUsedFpl] = useState("fpl-1");

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" maxWidth="1600px" p={3} margin="auto">
        <FplHeader usedFpl={usedFpl} setUsedFpl={setUsedFpl} />
        <FlightPlanTable />
      </Box>
    </ChakraProvider>
  );
};
