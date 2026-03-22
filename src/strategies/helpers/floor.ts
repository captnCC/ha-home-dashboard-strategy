import type {FloorRegistryEntry} from "home-assistant-frontend-types/frontend/data/floor_registry";
import type {LovelaceBadgeConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/badge";
import type {LovelaceCardConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {FloorConfig, HasAreasConfig, HasFloorsConfig} from "../config";

import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";
import {computeBadge} from "./badges";
import {mapAreas} from "./mapping";
import {computeAreaCard} from "./overview";


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
    badges.push(computeBadge(config.lights.all));
  }

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
    ...states.filter(sceneFilter).map(computeBadge),
    ...states.filter(scriptFilter).map(computeBadge),
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
