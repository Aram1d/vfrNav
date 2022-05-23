import {
  ActionIcon,
  Button,
  Group,
  Input,
  Menu,
  NumberInput,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { ChangeEvent, useState } from "react";
import { ArrowDown, ArrowUp, Clock, Trash, X } from "tabler-icons-react";
import * as React from "react";
import { ComputedLegs } from "../ComputationUtils";
import { useFplStore } from "../../api/flightPlanStore";
import { fiveCharsInputWidth, threeCharsInputWidth } from "./FlightPlanTable";
import { useMediaQuery } from "@mantine/hooks";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type FlightPlanTableRowProps = {
  index: number;
  leg: ArrayElement<ComputedLegs>;
};

export const FlightPlanTableRow = ({ index, leg }: FlightPlanTableRowProps) => {
  const { legsHandlers, hideWind, setDate, legs } = useFplStore();

  const [rebasePopover, setRebasePopOver] = useState<boolean>(false);
  const isSmall = useMediaQuery("(max-width: 1000px)");

  return (
    <tr key={index}>
      <td>
        <Stack>
          <NumberInput
            sx={fiveCharsInputWidth}
            step={100}
            value={leg.alt.desired}
            onChange={(desired = 1000) =>
              legsHandlers.setLeg(index, {
                alt: { desired },
              })
            }
            size="xs"
          />

          <NumberInput
            sx={fiveCharsInputWidth}
            step={100}
            value={leg.alt.minimal}
            defaultValue={500}
            onChange={(minimal = 500) =>
              legsHandlers.setLeg(index, { alt: { minimal } })
            }
            size="xs"
          />
        </Stack>
      </td>
      <td>
        <NumberInput
          sx={threeCharsInputWidth}
          min={0}
          max={360}
          value={leg.magneticRoute}
          onChange={(magneticRoute = 0) =>
            legsHandlers.setLeg(index, { magneticRoute })
          }
        />
      </td>
      <td>{leg.magneticCourse || "-  -  -"}</td>
      <td>
        <NumberInput
          sx={fiveCharsInputWidth}
          min={0}
          value={leg.distance}
          onChange={(distance = 0) => legsHandlers.setLeg(index, { distance })}
        />
      </td>
      <td>{leg.duration || "--"}</td>
      <td>{leg.correctedDuration || "--"}</td>
      <td>
        <Popover
          opened={rebasePopover}
          onClose={() => setRebasePopOver(false)}
          target={
            <Button variant="subtle" onClick={() => setRebasePopOver(true)}>
              {leg.reachDate.format("HH:mm") || "-- : --"}
            </Button>
          }
          width={270}
          position="bottom"
          withArrow
        >
          <Group>
            <Clock />
            <Text sx={{ width: "80%", fontSize: "14px", marginBottom: "10px" }}>
              Recaler le point sur l'heure actuelle?{" "}
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
              value={leg.wind.direction}
              onChange={(direction = 0) =>
                legsHandlers.setLeg(index, { wind: { direction } })
              }
            />
          </td>
          <td>
            <NumberInput
              sx={threeCharsInputWidth}
              min={0}
              value={leg.wind.velocity}
              onChange={(velocity = 0) =>
                legsHandlers.setLeg(index, { wind: { velocity } })
              }
            />
          </td>
        </>
      )}
      <td>
        {isSmall ? (
          <Menu>
            <Menu.Item
              icon={<ArrowUp />}
              onClick={() =>
                legsHandlers.reorder({ from: index, to: index - 1 })
              }
            >
              Move up
            </Menu.Item>
            <Menu.Item
              icon={<ArrowDown />}
              onClick={() =>
                legsHandlers.reorder({ from: index, to: index + 1 })
              }
            >
              Move down
            </Menu.Item>
            <Menu.Item
              icon={<Trash />}
              onClick={() => legsHandlers.remove(index)}
            >
              Delete segment
            </Menu.Item>
          </Menu>
        ) : (
          <Group sx={{ minWidth: "4em" }}>
            <ActionIcon
              variant="hover"
              onClick={() => legsHandlers.remove(index)}
            >
              <X />
            </ActionIcon>

            <Stack>
              <ActionIcon
                variant="hover"
                disabled={index === 0}
                onClick={() =>
                  legsHandlers.reorder({ from: index, to: index - 1 })
                }
              >
                <ArrowUp />
              </ActionIcon>
              <ActionIcon
                variant="hover"
                disabled={index === legs.length - 1}
                onClick={() =>
                  legsHandlers.reorder({ from: index, to: index + 1 })
                }
              >
                <ArrowDown />
              </ActionIcon>
            </Stack>
          </Group>
        )}
      </td>
    </tr>
  );
};
