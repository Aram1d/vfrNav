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
import { ChangeEvent, useEffect, useState } from "react";
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (rebasePopover) {
      const interval = setInterval(() => {
        setNow(new Date());
        return () => clearInterval(interval);
      }, 10000);
    }
  }, [setNow, now, rebasePopover]);

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
                alt: { desired: desired || 1000 },
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
              legsHandlers.setLeg(index, { alt: { minimal: minimal || 500 } })
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
          value={leg.magneticRoute}
          onChange={(magneticRoute = 0) =>
            legsHandlers.setLeg(index, { magneticRoute: magneticRoute || 0 })
          }
        />
      </td>
      <td>{leg.magneticCourse || "-  -  -"}</td>
      <td>
        <NumberInput
          sx={fiveCharsInputWidth}
          min={0}
          value={leg.distance}
          onChange={(distance = 0) =>
            legsHandlers.setLeg(index, { distance: distance || 0 })
          }
        />
      </td>
      <td>{leg.duration || "--"}</td>
      <td>{leg.correctedDuration || "--"}</td>
      <td>
        <Popover
          opened={rebasePopover}
          onClose={() => setRebasePopOver(false)}
          width={270}
          position="bottom"
          withArrow
        >
          <Popover.Target>
            <Button variant="subtle" onClick={() => setRebasePopOver(true)}>
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
              value={leg.wind.direction}
              onChange={(direction = 0) =>
                legsHandlers.setLeg(index, {
                  wind: { direction: direction || 0 },
                })
              }
            />
          </td>
          <td>
            <NumberInput
              sx={threeCharsInputWidth}
              min={0}
              value={leg.wind.velocity}
              onChange={(velocity = 0) =>
                legsHandlers.setLeg(index, {
                  wind: { velocity: velocity || 0 },
                })
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
              Monter
            </Menu.Item>
            <Menu.Item
              icon={<ArrowDown />}
              onClick={() =>
                legsHandlers.reorder({ from: index, to: index + 1 })
              }
            >
              Descendre
            </Menu.Item>
            <Menu.Item
              icon={<Trash />}
              onClick={() => legsHandlers.remove(index)}
            >
              Supprimer
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
