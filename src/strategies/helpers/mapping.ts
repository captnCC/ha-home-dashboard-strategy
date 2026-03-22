// oxlint-disable max-params
// oxlint-disable id-length
import type {AreaRegistryEntry} from "home-assistant-frontend-types/frontend/data/area/area_registry";
import type {FloorRegistryEntry} from "home-assistant-frontend-types/frontend/data/floor_registry";

import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {AreaConfig, FloorConfig, HasAreasConfig, HasFloorsConfig} from "../config";

export type AreaCallback<T> = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: AreaConfig,
) => T | null;

export const mapAreas = <T>(
  hass: HomeAssistant,
  configs: Record<string, AreaConfig>,
  callback: AreaCallback<T>,
  filter?: (area: [string, AreaRegistryEntry]) => boolean,
): NonNullable<T>[] =>
  Object.entries(hass.areas)
    .filter(filter ?? ((): true => true))
    .map(([areaId, area]) => callback(hass, area, configs?.[areaId] || {}))
    .filter((val) => val !== null) as NonNullable<T>[];

export type FloorCallback<T> = (
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  config: FloorConfig & HasAreasConfig,
) => T | null;

export const mapFloors = <T>(
  hass: HomeAssistant,
  config: HasFloorsConfig & HasAreasConfig,
  callback: FloorCallback<T>,
): NonNullable<T>[] => {
  const floorConfigs = typeof config.floors === "object" ? config.floors : {};
  return Object.entries(hass.floors)
    .map(([, floor]) =>
      callback(hass, floor, {
        ...floorConfigs[floor.floor_id],
        areas: config.areas ?? {},
      }),
    )
    .filter((val) => val !== null) as NonNullable<T>[];
};
