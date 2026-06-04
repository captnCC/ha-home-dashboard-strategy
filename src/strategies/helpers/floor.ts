import type { FloorRegistryEntry } from "@ha/data/floor_registry";
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { FloorConfig, HasAreasConfig, HasFloorsConfig } from "../config";

import { computeEntityBadge } from "./badges";
import { computeFloorCoversBadge } from "./covers";
import { computeFloorLightsBadge } from "./lights";
import { mapAreas } from "./mapping";
import { computeAreaCard } from "./overview";

export const getFloorConfig = (config: HasFloorsConfig, floorId: string): FloorConfig | null => {
  if (config.floors === false) {
    return null;
  }
  return config.floors?.[floorId] || {};
};

export const computeBadges = (
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  config: FloorConfig,
): LovelaceCardConfig[] => {
  const badges: LovelaceBadgeConfig[] = [];

  if (config.lights?.all) {
    badges.push(computeEntityBadge(config.lights.all));
  } else {
    badges.push(...computeFloorLightsBadge(hass, floor, "shortcut"));
  }

  badges.push(...computeFloorCoversBadge(hass, floor, "shortcut"));

  const sceneFilter = generateEntityFilter(hass, {
    domain: ["scene"],
    floor: floor.floor_id,
  });

  const scriptFilter = generateEntityFilter(hass, {
    domain: ["script"],
    floor: floor.floor_id,
  });

  const states = Object.keys(hass.states);

  badges.push(
    ...states.filter(sceneFilter).map(computeEntityBadge),
    ...states.filter(scriptFilter).map(computeEntityBadge),
    ...(config.badges ?? []),
  );

  return badges;
};

export const computeAreasSection = (
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  config: FloorConfig & HasAreasConfig,
): LovelaceCardConfig => {
  const areaCards = mapAreas<LovelaceCardConfig>(
    hass,
    config.areas ?? {},
    computeAreaCard,
    ([_id, area]) => area.floor_id === floor.floor_id,
  );

  return {
    cards: areaCards,
    column_span: 4,
    type: "grid",
  };
};
