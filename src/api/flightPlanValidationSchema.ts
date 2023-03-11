import { JTDSchemaType } from "ajv/dist/types/jtd-schema";
import { FplPersistantState } from "./flightPlanStore";
import Ajv from "ajv/dist/jtd";
import { ErrorObject } from "ajv";

const schema: JTDSchemaType<FplPersistantState> = {
  properties: {
    state: {
      properties: {
        aircraft: {
          properties: {
            registration: { type: "string" },
            cruiseSpeed: { type: "int32" },
          },
        },
        departureAirfield: {
          properties: {
            icao: { type: "string" },
          },
        },
        arrivalAirfield: {
          properties: {
            icao: { type: "string" },
          },
        },
        date: {
          type: "string",
        },
        legs: {
          elements: {
            //@ts-expect-error
            properties: {
              name: { type: "string" },
              alt: {
                properties: {
                  desired: { type: "float64" },
                  minimal: { type: "float64" },
                },
              },
              magneticRoute: { type: "float64" },
              distance: { type: "float64" },
              wind: {
                properties: {
                  direction: { type: "float64" },
                  velocity: { type: "float64" },
                },
              },
            },
          },
        },
        hideWind: {
          type: "boolean",
        },
      },
      optionalProperties: {
        //@ts-expect-error
        id: { type: "string" },
      },
    },
    version: { type: "float64" },
  },
};

export type AjvErrors =
  | ErrorObject<string, Record<string, any>, unknown>[]
  | null
  | undefined;

export const ajv = new Ajv();

export const fplValidatorV0 = ajv.compile(schema);
