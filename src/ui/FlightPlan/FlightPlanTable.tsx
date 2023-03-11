import { useFplStore } from "../../api/flightPlanStore";

import * as React from "react";
import { Button, Group, Table } from "@mantine/core";
import { FlightPlanTableRow } from "./FlightPlanTableRow";
import { useSmallScreen } from "../../api/utils";

import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const threeCharsInputWidth = { width: "6em" };
export const fiveCharsInputWidth = { width: "8em" };

export const FlightPlanTable = () => {
  const {
    computeLegs,
    hideWind,
    legsHandlers,
    legs: storedLegs,
  } = useFplStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const legs = computeLegs();
  const isWide = !useSmallScreen();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over) {
          const activeIndex = storedLegs.findIndex((l) => l.id === active.id);
          const overIndex = storedLegs.findIndex((l) => l.id === over?.id);
          legsHandlers.reorder({ from: activeIndex, to: overIndex });
          return arrayMove(legs, activeIndex, overIndex);
        }
      }}
    >
      <Table
        horizontalSpacing={isWide ? "md" : "sm"}
        verticalSpacing={isWide ? "md" : "sm"}
      >
        <thead>
          <tr>
            <th>Alt. Seg / Mini (ft)</th>
            <th>Rm (°)</th>
            <th>Cm (°)</th>
            <th>D (Nm)</th>
            <th>T (min)</th>
            <th>Tc (min)</th>
            <th style={{ textAlign: "center" }}>H</th>
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
          <SortableContext
            items={legs.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {legs.map((leg, index) => (
              <FlightPlanTableRow key={leg.id} index={index} leg={leg} />
            ))}
          </SortableContext>
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
    </DndContext>
  );
};
