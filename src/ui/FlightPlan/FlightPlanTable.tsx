import { useFplStore } from "../../api/flightPlanStore";
import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import * as React from "react";
import { FlightPlanTableRow } from "./FlightPlanTableRow";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";

export const FlightPlanTable = () => {
  const {
    setLeg,
    addLeg,
    removeLeg,
    setWind,
    setAlt,
    computeLegs,
    hideWind,
    setDate,
    date,
  } = useFplStore();

  const legs = computeLegs();

  const [isWide] = useMediaQuery("(min-width: 1000px)");

  return (
    <Table variant="simple" size={isWide ? "md" : "sm"}>
      <Thead>
        <Tr>
          <Th width={125}>Alt. Seg / Mini (ft)</Th>
          <Th width={130}>Rm (°)</Th>
          <Th>Cm (°)</Th>
          <Th width={150}>D (Nm)</Th>
          <Th>T (min)</Th>
          <Th>Tc (min)</Th>
          <Th>H</Th>
          {!hideWind && (
            <>
              <Th>Vent (°)</Th>
              <Th>Vent (Kts)</Th>
            </>
          )}
          <Th>Nom</Th>
        </Tr>
      </Thead>
      <Tbody>
        {legs.map((leg, index) => (
          <FlightPlanTableRow
            {...{
              key: index,
              leg,
              setLeg,
              date,
              setDate,
              index,
              hideWind,
              setWind,
              setAlt,
            }}
          />
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th colSpan={10}>
            <HStack width="100%">
              <Button onClick={() => addLeg()} size={isWide ? "md" : "sm"}>
                Ajouter un segment
              </Button>
              <Button onClick={() => removeLeg()} size={isWide ? "md" : "sm"}>
                Supprimer dernier segment
              </Button>
              <Box flexGrow={1} />
              <ColorModeSwitcher justifySelf="flex-end" />
            </HStack>
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
