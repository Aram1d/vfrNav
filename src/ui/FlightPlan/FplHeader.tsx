import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import * as React from "react";
import { useFplStore } from "../../api/flightPlanStore";
import DatePicker from "../DatePicker/DatePicker";

export type FplHeaderProps = {
  usedFpl: string;
  setUsedFpl: (fplId: string) => void;
};

export const FplHeader = ({ usedFpl, setUsedFpl }: FplHeaderProps) => {
  const {
    date,
    departureAirfield,
    aircraft,
    computation,
    arrivalAirfield,
    setArrivalAirfieldIcao,
    setDepartureAirfieldIcao,
    setAircraftRegistration,
    setAircraftCruiseSpeed,
    setDate,
  } = useFplStore();

  return (
    <StatGroup>
      <Stat size="sm" px={2}>
        <StatLabel>Appareil: </StatLabel>
        <StatNumber>
          <Editable
            value={aircraft.registration}
            onChange={(nextValue) => setAircraftRegistration(nextValue)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </StatNumber>
      </Stat>
      <Stat size="sm" px={2}>
        <StatLabel>Vitesse de croisière (Kts): </StatLabel>
        <StatNumber>
          <Editable
            value={aircraft.cruiseSpeed.toString()}
            onChange={(nextValue) => setAircraftCruiseSpeed(nextValue)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </StatNumber>
        <StatHelpText>Fb: {computation?.baseFactor()}</StatHelpText>
      </Stat>
      <Stat size="sm" px={2}>
        <StatLabel>Provenance: </StatLabel>
        <StatNumber>
          <Editable
            value={departureAirfield.icao}
            onChange={(nextValue) => setDepartureAirfieldIcao(nextValue)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </StatNumber>
      </Stat>
      <Stat size="sm" px={2}>
        <StatLabel>Destination: </StatLabel>
        <StatNumber>
          <Editable
            value={arrivalAirfield.icao}
            onChange={(nextValue) => setArrivalAirfieldIcao(nextValue)}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </StatNumber>
      </Stat>
      <Stat size="sm" px={2}>
        <StatLabel>Date et heure du vol</StatLabel>
        <StatNumber>
          <DatePicker
            onChange={(date) => setDate(date as Date)}
            selectedDate={new Date(date)}
          />
        </StatNumber>

        <HStack mt={2}>
          <NumberInput
            min={0}
            max={23}
            value={dayjs(date).hour()}
            onChange={(hours) =>
              setDate(dayjs(date).hour(parseFloat(hours)).toDate())
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
            min={0}
            max={59}
            value={dayjs(date).minute()}
            onChange={(minutes) =>
              setDate(dayjs(date).minute(parseFloat(minutes)).toDate())
            }
            size="xs"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </Stat>
      <Stat size="sm" px={2}>
        <VStack>
          <Select
            mt={6}
            placeholder="Selection FPL"
            value={usedFpl}
            onChange={({ target }) => {
              //@ts-expect-error bad typing
              useFplStore.persist.setOptions({
                name: `vfr-nav-${target.value}`,
              });
              //@ts-expect-error bad typing
              useFplStore.persist.rehydrate();
              setUsedFpl(target.value);
            }}
          >
            <option value="fpl-1">FPL 1</option>
            <option value="fpl-2">FPL 2</option>
            <option value="fpl-3">FPL 3</option>
            <option value="fpl-4">FPL 4</option>
          </Select>
          {/*<ColorModeSwitcher justifySelf="flex-end" />*/}
        </VStack>
      </Stat>
    </StatGroup>
  );
};
