import {
  Button,
  ButtonGroup,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Td,
  Tr,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import * as React from "react";
import { ComputedLegs } from "../ComputationUtils";
import { FlightPlanStore } from "../../api/flightPlanStore";

type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type FlightPlanTableRowProps = {
  leg: ArrayElement<ComputedLegs>;
  hideWind: boolean;
  index: number;
} & Pick<FlightPlanStore, "setLeg" | "setAlt" | "date" | "setDate" | "setWind">;

export const FlightPlanTableRow = ({
  leg,
  index,
  setLeg,
  setAlt,
  setDate,
  setWind,
  hideWind,
}: FlightPlanTableRowProps) => {
  const [rebasePopover, { on, off }] = useBoolean(false);

  return (
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
      <Td>{leg.magneticCourse || "-"}</Td>
      <Td>
        <NumberInput
          min={0}
          value={leg.distance}
          onChange={(dist) => setLeg(index, "distance", parseFloat(dist) || 0)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td>{leg.duration || "-"}</Td>
      <Td>{leg.correctedDuration || "-"}</Td>
      <Td>
        <Popover
          returnFocusOnClose={false}
          isOpen={rebasePopover}
          onClose={off}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button onClick={on}>{leg.reachDate.format("HH:mm")}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Voulez-vous recaler votre navigation sur cet point?
            </PopoverBody>
            <PopoverFooter d="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button variant="outline" onClick={off}>
                  Annuler
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setDate(
                      dayjs(new Date())
                        .subtract(leg.cumulatedTimeToWPT, "minutes")
                        .toDate()
                    );
                    off();
                  }}
                >
                  Recaler
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Td>
      {!hideWind && (
        <>
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
        </>
      )}
      <Td>
        <Input
          value={leg.name}
          onChange={({ target }) => setLeg(index, "name", target.value)}
        />
      </Td>
    </Tr>
  );
};
