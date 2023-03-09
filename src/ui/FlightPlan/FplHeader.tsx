import * as React from "react";
import { useFplStore } from "../../api/flightPlanStore";
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Input,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { FlightPlanImportExport } from "./FlightPlanImportExport";
import { MoonStars, Sun } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

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

  const [fplList, setFplList] = useState<string[]>(getFplList());

  const [addFpl, { close, open }] = useDisclosure(false);
  const [addFplName, setAddFplName] = React.useState<string>("");

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <>
      <Modal title="Ajouter un plan de vol" opened={addFpl} onClose={close}>
        <Stack>
          <TextInput
            label="Nom du nouveau plan de vol"
            value={addFplName}
            onChange={(e) => setAddFplName(e.currentTarget.value)}
          />
          <Group>
            <Button
              disabled={!addFplName}
              onClick={() => {
                loadFPL(addFplName, setUsedFpl);
                setFplList(getFplList());
                setAddFplName("");
                close();
              }}
            >
              Ajouter
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Grid columns={24}>
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
            value={aircraft.cruiseSpeed}
            onChange={(speed) => setAircraftCruiseSpeed(speed || 0)}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <Input.Wrapper
            label="Trajet: "
            description="Provenance / Destination"
          >
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
        <Grid.Col span={6}>
          <Input.Wrapper
            label="Date et heure: "
            description="du début de la navigation"
          >
            <Group>
              <DateTimePicker
                onChange={(date) => setDate(date as Date)}
                value={getDate()}
                sx={(t) => ({
                  marginTop: `${parseFloat(t.spacing.xs) / 2}rem`,
                  position: "relative",
                })}
              />
            </Group>
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack>
            <Input.Wrapper
              label="Selection FPL"
              description={<FlightPlanImportExport fplId={usedFpl} />}
            >
              <Select
                mt={6}
                placeholder="Selection FPL"
                allowDeselect={false}
                value={usedFpl}
                onChange={(value) => {
                  if (value === "addFpl") {
                    open();
                    return;
                  }
                  loadFPL(value as string, setUsedFpl);
                }}
                data={[
                  ...fplList.map((val) => ({
                    value: val,
                    label: "FPL " + val,
                  })),
                  { value: "addFpl", label: "Ajouter un FPL" },
                ]}
              />
            </Input.Wrapper>
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
    </>
  );
};

const loadFPL = (value: string, setUsedFpl: (fplName: string) => void) => {
  useFplStore.persist.setOptions({
    name: `vfr-nav-fpl-${value}`,
  });
  useFplStore.persist.rehydrate();
  setUsedFpl(value);
};

const getFplList = () =>
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith("vfr-nav-fpl-"))
    .map((k) => k.replace(/vfr-nav-fpl-/, ""));
