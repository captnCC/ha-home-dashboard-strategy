import type { EntityFilterFunc } from "@ha/common/entity/entity_filter";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import { computeAreaTileCardConfig, extendLastCard } from "./cards";
import { mapAreas } from "./mapping";
import { generateAreaHeading } from "./sections";

export const generateSecurityEntityFilters = (
  hass: HomeAssistant,
  area: string,
): EntityFilterFunc[] => [
  generateEntityFilter(hass, {
    area: area,
    domain: "alarm_control_panel",
    entity_category: "none",
  }),
  generateEntityFilter(hass, {
    area: area,
    domain: "lock",
    entity_category: "none",
  }),
  generateEntityFilter(hass, {
    area: area,
    domain: "camera",
    entity_category: "none",
  }),
  generateEntityFilter(hass, {
    area: area,
    device_class: ["door", "garage_door", "window", "moisture", "motion"],
    domain: "binary_sensor",
    entity_category: "none",
  }),
];

export const computeSecurityAreaSections = (hass: HomeAssistant): LovelaceCardConfig[] => {
  const states = Object.keys(hass.states);
  return mapAreas(hass, {}, (_hass, area) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);
    const filters = generateSecurityEntityFilters(hass, area.area_id);
    const cards = filters.flatMap((filter) => states.filter(filter)).map(computeTileCard);
    if (cards.length === 0) {
      return null;
    }
    return {
      cards: [generateAreaHeading(area), ...extendLastCard(cards)],
      type: "grid",
    };
  });
};
