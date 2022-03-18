import { useFplStore } from "../../api/flightPlanStore";
import {
  Button,
  ChakraProvider,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  theme,
  Tr,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";

export const FlightPlanTable = () => {
  const { legs, setLeg, addLeg, removeLeg, setWind, setAlt, legComputation } =
    useFplStore();

  const [isWide] = useMediaQuery("(min-width: 1000px)");

  return (
    <ChakraProvider theme={theme}>
      <Table variant="simple" size={isWide ? "md" : "sm"}>
        <Thead>
          <Tr>
            <Th>Alt. Seg / Mini (ft)</Th>
            <Th>Rm (°)</Th>
            <Th>Cm (°)</Th>
            <Th>D (Nm)</Th>
            <Th>T (min)</Th>
            <Th>Tc (min)</Th>
            <Th>H</Th>
            <Th>Vent (°)</Th>
            <Th>Vent (Kts)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {legs.map((leg, index) => (
            <Tr key={index}>
              <Td>
                <VStack>
                  <NumberInput
                    step={100}
                    value={leg.alt.desired}
                    onChange={(desired) =>
                      setAlt(index, "desired", parseFloat(desired) || 0)
                    }
                    size="xs"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <NumberInput
                    step={100}
                    value={leg.alt.minimal}
                    onChange={(minimal) =>
                      setAlt(index, "minimal", parseFloat(minimal) || 0)
                    }
                    size="xs"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </VStack>
              </Td>
              <Td>
                <NumberInput
                  min={0}
                  max={360}
                  value={leg.magneticRoute}
                  onChange={(mag) =>
                    setLeg(index, "magneticRoute", parseFloat(mag) || 0)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
              <Td>{legComputation(index).magneticCourse() || "-"}</Td>
              <Td>
                <NumberInput
                  min={0}
                  value={leg.distance}
                  onChange={(dist) =>
                    setLeg(index, "distance", parseFloat(dist) || 0)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
              <Td>{legComputation(index).duration() || "-"}</Td>
              <Td>{legComputation(index).correctedDuration() || "-"}</Td>
              <Td>-h pass-</Td>
              <Td>
                <NumberInput
                  min={0}
                  max={360}
                  value={leg.wind.direction}
                  onChange={(mag) =>
                    setWind(index, "direction", parseFloat(mag) || 0)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
              <Td>
                <NumberInput
                  min={0}
                  value={leg.wind.velocity}
                  onChange={(mag) =>
                    setWind(index, "velocity", parseFloat(mag) || 0)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th colSpan={6}>
              <HStack>
                <Button onClick={() => addLeg()} size={isWide ? "md" : "sm"}>
                  Ajouter un segment
                </Button>
                <Button onClick={() => removeLeg()} size={isWide ? "md" : "sm"}>
                  Supprimer un segment
                </Button>
              </HStack>
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </ChakraProvider>
  );
};
