import React from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { Edit } from "tabler-icons-react";
import { useFplKeyStore } from "../../api/flightPlanStore";
import { FlightPlanImportExport } from "./FlightPlanImportExport";
import {
  getFplName,
  useAddEditDisclosure,
  useSmallScreen,
} from "../../api/utils";

export const FlightPlanSelect = () => {
  const { add, edit, close, openAdd, openEdit } = useAddEditDisclosure();
  const [fplName, setAddFplName] = React.useState<string>("");
  const { selectedFplKey, fplList, loadFpl, addFpl, editFpl, deleteFpl } =
    useFplKeyStore();

  const isSmall = useSmallScreen();

  return (
    <>
      <Modal
        title={
          add ? "Ajouter un plan de vol" : "Modifier le nom du plan de vol"
        }
        opened={add || edit}
        onClose={close}
      >
        <Stack>
          <TextInput
            label="Nom du plan de vol"
            value={fplName}
            onChange={(e) => setAddFplName(e.currentTarget.value)}
          />
          <Group>
            <Button
              disabled={!fplName}
              onClick={() => {
                add ? addFpl(fplName) : editFpl(fplName);
                setAddFplName("");
                close();
              }}
            >
              {add ? "Ajouter" : "Modifier"}
            </Button>
            {edit && (
              <Button
                onClick={() => {
                  deleteFpl();
                  close();
                }}
              >
                Supprimer
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>

      <Group sx={{ alignItems: "flex-end", flexWrap: "unset" }}>
        <Select
          label="Selection FPL"
          description={<FlightPlanImportExport fplId={selectedFplKey} />}
          placeholder="Selection FPL"
          allowDeselect={false}
          value={selectedFplKey}
          onChange={(value) => {
            if (value === "addFpl") {
              openAdd();
              return;
            }
            loadFpl(value as string);
          }}
          data={[...fplList, { value: "addFpl", label: "Ajouter un FPL" }]}
          styles={{ wrapper: { marginTop: isSmall ? 0 : 8 } }}
        />
        <ActionIcon
          variant="light"
          size={isSmall ? "md" : "xl"}
          sx={{ top: 1 }}
          onClick={() => {
            setAddFplName(getFplName(selectedFplKey));
            openEdit();
          }}
        >
          <Edit />
        </ActionIcon>
      </Group>
    </>
  );
};
