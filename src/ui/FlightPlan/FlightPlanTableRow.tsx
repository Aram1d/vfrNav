import {
  ActionIcon,
  Button,
  Group,
  Input,
  NumberInput,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import * as React from "react";
import { ChangeEvent, useEffect, useState } from "react";
import { Clock, DragDrop2, X } from "tabler-icons-react";
import { ComputedLegs } from "../../api/computationUtils";
import { useFplStore } from "../../api/flightPlanStore";
import { fiveCharsInputWidth, threeCharsInputWidth } from "./FlightPlanTable";
import {
  nanifyEmptyString,
  stringifyNaN,
  useSmallScreen,
} from "../../api/utils";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type FlightPlanTableRowProps = {
  index: number;
  leg: ArrayElement<ComputedLegs>;
};

export const FlightPlanTableRow = ({ index, leg }: FlightPlanTableRowProps) => {
  const { legsHandlers, hideWind, setDate } = useFplStore();

  const [rebasePopover, setRebasePopOver] = useState<boolean>(false);
  const [now, setNow] = useState(new Date());

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: leg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (rebasePopover) {
      const interval = setInterval(() => {
        setNow(new Date());
        return () => clearInterval(interval);
      }, 10000);
    }
  }, [setNow, now, rebasePopover]);

  const isSmall = useSmallScreen();

  return (
    <tr key={index} ref={setNodeRef} {...attributes} style={style}>
      <td>
        <Stack>
          <NumberInput
            sx={fiveCharsInputWidth}
            step={100}
            value={stringifyNaN(leg.alt.desired)}
            onChange={(desired) =>
              legsHandlers.setLeg(index, {
                alt: { desired: nanifyEmptyString(desired) },
              })
            }
            size="xs"
          />

          <NumberInput
            sx={fiveCharsInputWidth}
            step={100}
            value={stringifyNaN(leg.alt.minimal)}
            defaultValue={500}
            onChange={(minimal) =>
              legsHandlers.setLeg(index, {
                alt: { minimal: nanifyEmptyString(minimal) },
              })
            }
            size="xs"
            styles={(t) => ({ input: { color: t.colors.red[6] } })}
          />
        </Stack>
      </td>
      <td>
        <NumberInput
          sx={threeCharsInputWidth}
          min={0}
          max={360}
          value={stringifyNaN(leg.magneticRoute)}
          onChange={(magneticRoute) =>
            legsHandlers.setLeg(index, {
              magneticRoute: nanifyEmptyString(magneticRoute),
            })
          }
        />
      </td>
      <td style={{ textAlign: "center" }}>{leg.magneticCourse || "-  -  -"}</td>
      <td>
        <NumberInput
          sx={fiveCharsInputWidth}
          min={0}
          value={stringifyNaN(leg.distance)}
          onChange={(distance) =>
            legsHandlers.setLeg(index, {
              distance: nanifyEmptyString(distance),
            })
          }
        />
      </td>
      <td style={{ textAlign: "center" }}>{leg.duration || "--"}</td>
      <td style={{ textAlign: "center" }}>{leg.correctedDuration || "--"}</td>
      <td data-no-dnd="true">
        <Popover
          opened={rebasePopover}
          onClose={() => setRebasePopOver(false)}
          width={270}
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Button
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                setRebasePopOver(true);
              }}
            >
              {leg.reachDate.format("HH:mm") || "-- : --"}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Group>
              <Clock />
              <Text
                sx={{ width: "80%", fontSize: "14px", marginBottom: "10px" }}
              >
                {`Caler la verticale de ${leg.name || "ce point"} à ${dayjs(
                  now
                ).format("HH:mm")} `}
                ?
              </Text>
            </Group>
            <Group>
              <Button
                onClick={() => {
                  setDate(
                    dayjs(new Date())
                      .subtract(leg.cumulatedTimeToWPT, "minutes")
                      .toDate()
                  );
                  setRebasePopOver(false);
                }}
              >
                Recaler
              </Button>
              <Button onClick={() => setRebasePopOver(false)}>Annuler</Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </td>
      {hideWind ? (
        <td>
          <Input
            value={leg.name}
            onChange={({ currentTarget }: ChangeEvent<HTMLInputElement>) =>
              legsHandlers.setLeg(index, { name: currentTarget.value })
            }
          />
        </td>
      ) : (
        <>
          <td>
            <NumberInput
              sx={threeCharsInputWidth}
              min={0}
              max={360}
              value={stringifyNaN(leg.wind.direction)}
              onChange={(direction) =>
                legsHandlers.setLeg(index, {
                  wind: { direction: nanifyEmptyString(direction) },
                })
              }
            />
          </td>
          <td>
            <NumberInput
              sx={threeCharsInputWidth}
              min={0}
              value={stringifyNaN(leg.wind.velocity)}
              onChange={(velocity) =>
                legsHandlers.setLeg(index, {
                  wind: { velocity: nanifyEmptyString(velocity) },
                })
              }
            />
          </td>
        </>
      )}
      <td>
        <Group sx={{ minWidth: "4em" }}>
          <ActionIcon
            onClick={() => legsHandlers.remove(index)}
            size={isSmall ? "lg" : "xl"}
          >
            <X />
          </ActionIcon>
          <ActionIcon {...listeners} size={isSmall ? "lg" : "xl"}>
            <DragDrop2 />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
};
