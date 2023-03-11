import * as React from "react";
import { useFplStore } from "../../api/flightPlanStore";
import {
  ActionIcon,
  Grid,
  Input,
  NumberInput,
  SegmentedControl,
  SimpleGrid,
  Stack,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { MoonStars, Sun } from "tabler-icons-react";
import { FlightPlanSelect } from "./FlightPlanSelect";
import {
  nanifyEmptyString,
  stringifyNaN,
  useSmallScreen,
} from "../../api/utils";

export const FplHeader = () => {
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
  const isSmall = useSmallScreen();

  return (
    <Grid columns={24} mx={0}>
      <Grid.Col sx={{ minWidth: 84 }} span={3}>
        <TextInput
          label="Appareil:"
          description="immatriculation"
          onChange={({ currentTarget }: any) =>
            setAircraftRegistration(currentTarget.value)
          }
          value={aircraft.registration}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          label="Vp CRZ (Kts): "
          description={`Fb: ${getBaseFactor().toFixed(3)}`}
          hideControls
          value={stringifyNaN(aircraft.cruiseSpeed)}
          onChange={(speed) => setAircraftCruiseSpeed(nanifyEmptyString(speed))}
        />
      </Grid.Col>
      <Grid.Col span={5}>
        <Input.Wrapper label="Trajet: " description="Provenance / Destination">
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
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={4}>
        <DateTimePicker
          label="Date et heure: "
          description="du début de la navigation"
          onChange={(date) => setDate(date as Date)}
          value={getDate()}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <FlightPlanSelect />
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack
          sx={{
            height: "100%",
            gap: 0,
            justifyContent: "space-between",
            alignItems: "flex-end",
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
            sx={isSmall ? { top: "2px" } : {}}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
