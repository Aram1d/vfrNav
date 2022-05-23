import { Group, MantineTheme, Text } from "@mantine/core";
import { Upload } from "tabler-icons-react";
import { AjvErrors } from "../../api/FlightPlanValidationSchema";

function getIconColor(
  theme: MantineTheme,
  { ajvErr, isFplLoaded }: { ajvErr: AjvErrors; isFplLoaded: boolean }
) {
  return isFplLoaded && !ajvErr?.length
    ? theme.colors.green[theme.colorScheme === "dark" ? 4 : 6]
    : isFplLoaded && ajvErr?.length
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

export const DropzoneChildren = (
  theme: MantineTheme,
  { ajvErr, isFplLoaded }: { ajvErr: AjvErrors; isFplLoaded: boolean }
) => {
  return (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: "none" }}
    >
      <Upload
        style={{ color: getIconColor(theme, { ajvErr, isFplLoaded }) }}
        size={80}
      />

      <div>
        <Text size="xl" inline>
          Importer un plan de vol
        </Text>

        {isFplLoaded && !ajvErr && (
          <Text size="sm" color="dimmed" inline mt={7}>
            Plan de vol valide!
          </Text>
        )}
        {isFplLoaded && Boolean(ajvErr?.length) && (
          <Text size="sm" color="dimmed" inline mt={7}>
            Votre plan de vol est est corrompu.
          </Text>
        )}
        {!isFplLoaded && (
          <Text size="sm" color="dimmed" inline mt={7}>
            Glissez un fichier ou cliquez ici.
          </Text>
        )}
      </div>
    </Group>
  );
};
