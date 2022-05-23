import * as React from "react";
import { useFplStore } from "../../api/flightPlanStore";
import {
  ActionIcon,
  Grid,
  Group,
  Input,
  InputWrapper,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { FlightPlanImportExport } from "./FlightPlanImportExport";
import { MoonStars, Sun } from "tabler-icons-react";

export type FplHeaderProps = {
  usedFpl: string;
  setUsedFpl: (fplId: string) => void;
};

export const FplHeader = ({ usedFpl, setUsedFpl }: FplHeaderProps) => {
  const {
    getDate,
    departureAirfield,
    aircraft,
    getBaseFactor,
    arrivalAirfield,
    setArrivalAirfieldIcao,
    setDepartureAirfieldIcao,
    setAircraftRegistration,
    setAircraftCruiseSpeed,
    setDate,
    hideWind,
    toggleHideWind,
  } = useFplStore();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Grid columns={24}>
      <Grid.Col sx={{ minWidth: 84 }} span={3}>
        <InputWrapper label="Appareil:" description="immatriculation">
          <Input
            onChange={({ currentTarget }: any) =>
              setAircraftRegistration(currentTarget.value)
            }
            value={aircraft.registration}
          />
        </InputWrapper>
      </Grid.Col>
      <Grid.Col span={3}>
        <InputWrapper
          label="Vp CRZ (Kts): "
          description={`Fb: ${getBaseFactor()}`}
        >
          <NumberInput
            hideControls
            value={aircraft.cruiseSpeed}
            onChange={(speed) => setAircraftCruiseSpeed(speed || 0)}
          />
        </InputWrapper>
      </Grid.Col>
      <Grid.Col span={5}>
        <InputWrapper label="Trajet: " description="Provenance / Destination">
          <SimpleGrid cols={2}>
            <Input
              value={departureAirfield.icao}
              onChange={({ currentTarget }: any) =>
                setDepartureAirfieldIcao(currentTarget.value)
              }
            />
            <Input
              value={arrivalAirfield.icao}
              onChange={({ currentTarget }: any) =>
                setArrivalAirfieldIcao(currentTarget.value)
              }
            />
          </SimpleGrid>
        </InputWrapper>
      </Grid.Col>
      <Grid.Col span={6}>
        <InputWrapper
          label="Date et heure: "
          description="du début de la navigation"
        >
          <Group>
            <DatePicker
              sx={{ width: "55%" }}
              onChange={(date) => setDate(date as Date)}
              value={getDate()}
            />
            <TimeInput value={getDate()} onChange={(date) => setDate(date)} />
          </Group>
        </InputWrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Stack>
          <InputWrapper
            label="Selection FPL"
            description={<FlightPlanImportExport fplId={usedFpl} />}
          >
            <Select
              mt={6}
              placeholder="Selection FPL"
              allowDeselect={false}
              value={usedFpl}
              onChange={(value) => {
                //@ts-expect-error bad typing
                useFplStore.persist.setOptions({
                  name: `vfr-nav-${value}`,
                });
                //@ts-expect-error bad typing
                useFplStore.persist.rehydrate();
                setUsedFpl(value as string);
              }}
              data={[1, 2, 3, 4].map((val) => ({
                value: "fpl-" + val,
                label: "FPL " + val,
              }))}
            />
          </InputWrapper>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack
          sx={{
            height: "100%",
            paddingTop: "5px",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: "11px",
          }}
        >
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <Sun size={18} /> : <MoonStars size={18} />}
          </ActionIcon>
          <SegmentedControl
            onChange={toggleHideWind}
            value={hideWind ? "title" : "wind"}
            data={[
              { value: "wind", label: "Vent" },
              { value: "title", label: "Point" },
            ]}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
