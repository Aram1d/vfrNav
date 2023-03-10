import { useFplStore } from "../../api/flightPlanStore";

import * as React from "react";
import { Button, Group, Table } from "@mantine/core";
import { FlightPlanTableRow } from "./FlightPlanTableRow";
import { useSmallScreen } from "../../api/utils";

export const threeCharsInputWidth = { width: "6em" };
export const fiveCharsInputWidth = { width: "8em" };

export const FlightPlanTable = () => {
  const { computeLegs, hideWind, legsHandlers } = useFplStore();

  const legs = computeLegs();

  const isWide = !useSmallScreen();

  return (
    <Table
      horizontalSpacing={isWide ? "md" : "sm"}
      verticalSpacing={isWide ? "md" : "sm"}
      sx={{
        "tr > td:first-child, th:first-child": {
          paddingLeft: 0,
        },
        "tr > td:last-child, th:last-child": {
          paddingRight: 0,
        },
      }}
    >
      <thead>
        <tr>
          <th>Alt. Seg / Mini (ft)</th>
          <th>Rm (°)</th>
          <th>Cm (°)</th>
          <th>D (Nm)</th>
          <th>T (min)</th>
          <th>Tc (min)</th>
          <th>H</th>
          {hideWind ? (
            <th>Nom point</th>
          ) : (
            <>
              <th>Vent (°)</th>
              <th>Vent (Kts)</th>
            </>
          )}
          <th />
        </tr>
      </thead>
      <tbody>
        {legs.map((leg, index) => (
          <FlightPlanTableRow key={index} index={index} leg={leg} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={12}>
            <Group>
              <Button
                onClick={() => legsHandlers.append()}
                size={isWide ? "md" : "sm"}
              >
                Ajouter un segment
              </Button>
            </Group>
          </th>
        </tr>
      </tfoot>
    </Table>
  );
};
