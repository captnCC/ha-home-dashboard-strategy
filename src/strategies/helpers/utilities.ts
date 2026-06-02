import type { EntityFilterFunc } from "@ha/common/entity/entity_filter";
import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import { computeAreaTileCardConfig } from "./cards";
import { mapAreas } from "./mapping";
import { generateAreaHeading } from "./sections";

export const generateUtilitiesEntityFilters = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
): EntityFilterFunc[] => [
  generateEntityFilter(hass, {
    area: area.area_id,
    device_class: "battery",
    domain: "sensor",
  }),
];

export const generateDevicesEntityFilters = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
): EntityFilterFunc[] => [
  generateEntityFilter(hass, {
    area: area.area_id,
    domain: "vacuum",
  }),
  generateEntityFilter(hass, {
    area: area.area_id,
    device_class: "outlet",
    domain: "switch",
  }),
];

export const computeUtilityAreas = (hass: HomeAssistant): LovelaceCardConfig[] => {
  const states = Object.keys(hass.states);
  return mapAreas(hass, {}, (_hass, area): LovelaceCardConfig | null => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const filters = [
      ...generateDevicesEntityFilters(hass, area),
      ...generateUtilitiesEntityFilters(hass, area),
    ];

    const cards = filters.flatMap((filter) => states.filter(filter)).map(computeTileCard);

    if (cards.length === 0) {
      return null;
    }

    return {
      cards: [generateAreaHeading(area), ...cards],
      type: "grid",
    };
  });
};
