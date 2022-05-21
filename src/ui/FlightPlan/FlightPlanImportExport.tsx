import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { FlightPlanStore, useFplStore } from "../../api/flightPlanStore";
import dayjs from "dayjs";
import FileDownloader from "js-file-downloader";
import { useState } from "react";

async function loadFlightPlan(fpl: File, fplId: string) {
  const fileReader = new FileReader();
  fileReader.readAsText(fpl);
  await new Promise((resolve, reject) => {
    fileReader.addEventListener("loadend", resolve);
    fileReader.addEventListener("error", reject);
  });
  window.localStorage.setItem(`vfr-nav-${fplId}`, fileReader.result as string);
  //@ts-expect-error types missing for persist
  await useFplStore.persist.rehydrate();
}

type FlightPlanImportExportProps = {
  fplId: string;
} & Pick<FlightPlanStore, "departureAirfield" | "arrivalAirfield" | "date">;
export const FlightPlanImportExport = ({
  departureAirfield,
  arrivalAirfield,
  date,
  fplId,
}: FlightPlanImportExportProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HStack>
        <Button
          size="xs"
          onClick={async () => {
            const fpl = window.localStorage.getItem(`vfr-nav-${fplId}`);
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
          Sauvegarder
        </Button>
        <Button size="xs" onClick={onOpen}>
          Charger
        </Button>
      </HStack>
      <FlightPlanImportModal {...{ isOpen, onClose }} />
    </>
  );
};

const FlightPlanImportModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importer un plan de vol</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="file"
            onChange={({ target }) => setFile(target.files?.[0] ?? null)}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="solid"
            disabled={!file}
            onClick={() => loadFlightPlan(file as File, "dd").then(onClose)}
          >
            Charger
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
