import * as React from "react";
import { useEffect, useState } from "react";

import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone } from "@mantine/dropzone";
import { FileDownload, FileUpload } from "tabler-icons-react";
import { useFplStore } from "../../api/flightPlanStore";
import dayjs from "dayjs";
import FileDownloader from "js-file-downloader";

import { DropzoneChildren } from "../ImportDropzone/DropzoneChildren";
import {
  AjvErrors,
  fplValidatorV0,
} from "../../api/flightPlanValidationSchema";
import { useSmallScreen } from "../../api/utils";

type FlightPlanImportExportProps = {
  fplId: string;
};

export const FlightPlanImportExport = ({
  fplId,
}: FlightPlanImportExportProps) => {
  const { departureAirfield, arrivalAirfield, date } = useFplStore();
  const [isOpened, handlers] = useDisclosure(false);
  const isSmall = useSmallScreen();
  const textSX = { fontSize: isSmall ? 8 : 14 };
  return (
    <>
      <Group spacing={5}>
        <ActionIcon size={14} sx={{ width: "auto" }} onClick={handlers.open}>
          <FileDownload size="14px" /> <Text sx={textSX}>import</Text>
        </ActionIcon>
        <ActionIcon
          size={14}
          sx={{ width: "auto" }}
          onClick={async () => {
            const fpl = window.localStorage.getItem(fplId);
            if (!fpl) return;

            const filename = `${departureAirfield.icao}-${
              arrivalAirfield.icao
            }-${dayjs(date).format("DD.MM.YYYY")}.json`;
            const file = new File([fpl], filename, {
              type: "application/json",
            });

            const url = URL.createObjectURL(file);
            await new FileDownloader({ url, filename })
              .then(() => URL.revokeObjectURL(url))
              .catch(() => URL.revokeObjectURL(url));
          }}
        >
          <FileUpload size="14px" />
          <Text sx={textSX}>export</Text>
        </ActionIcon>
      </Group>
      <FlightPlanImportModal
        {...{ isOpened, onClose: handlers.close, fplId }}
      />
    </>
  );
};

const FlightPlanImportModal = ({
  fplId,
  isOpened,
  onClose,
}: {
  fplId: string;
  isOpened: boolean;
  onClose: () => void;
}) => {
  const [fpl, setFpl] = useState<any>(null);
  const [ajvErr, setAjvErr] = useState<AjvErrors | Error[]>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (!isOpened) {
      setFpl(null);
      setAjvErr(null);
    }
  }, [isOpened, setAjvErr, setFpl]);

  return (
    <Modal opened={isOpened} onClose={onClose} title="Importer un plan de vol">
      <Dropzone
        onDrop={async (files) => {
          const fplFile = files[0];
          const fileReader = new FileReader();

          fileReader.readAsText(fplFile);
          await new Promise((resolve, reject) => {
            fileReader.addEventListener("loadend", resolve);
            fileReader.addEventListener("error", reject);
          });

          setFpl(JSON.parse(fileReader.result as string));
          setAjvErr(fplValidatorV0.errors);
        }}
        onReject={() => {
          setAjvErr([new Error("Fichier incorrect")]);
        }}
        accept={["application/json"]}
      >
        {() => DropzoneChildren(theme, { ajvErr, isFplLoaded: Boolean(fpl) })}
      </Dropzone>

      <Group mt={theme.spacing.md}>
        <Button
          disabled={!fpl && Boolean(ajvErr)}
          onClick={async () => {
            window.localStorage.setItem(fplId, JSON.stringify(fpl));
            await useFplStore.persist.rehydrate();
            onClose();
          }}
        >
          Charger
        </Button>
        <Button variant="outline" mr={3} onClick={onClose}>
          Annuler
        </Button>
      </Group>
    </Modal>
  );
};
