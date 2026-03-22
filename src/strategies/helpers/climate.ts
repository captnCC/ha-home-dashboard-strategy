// oxlint-disable max-statements
// oxlint-disable max-lines-per-function
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { AreaConfig } from "../config";

import { computeAreaTileCardConfig, generateCardSort } from "./cards";
import { mapAreas } from "./mapping";
import { tapNavigate } from "./navigate";
import { areaPath } from "./paths";

export const computeClimateAreas = (
  hass: HomeAssistant,
  configs: Record<string, AreaConfig> = {},
): LovelaceBadgeConfig[] =>
  mapAreas(hass, configs, (_hass, area, config): LovelaceBadgeConfig | null => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);
    const devicesFilter = generateEntityFilter(hass, {
      area: area.area_id,
      domain: ["climate", "fan"],
    });

    const sensorFilter = generateEntityFilter(hass, {
      area: area.area_id,
      device_class: ["temperature", "humidity", "pm25", "co2", "aqi"],
      domain: ["sensor"],
    });

    const states = Object.keys(hass.states);

    const cards = [...states.filter(devicesFilter), ...states.filter(sensorFilter)]
      .toSorted(generateCardSort(config.climate?.order))
      .map(computeTileCard);

    if (cards.length === 0) {
      return null;
    }

    const badges: LovelaceBadgeConfig[] = [];

    if (area.temperature_entity_id) {
      badges.push({
        entity: area.temperature_entity_id,
        state_color: true,
        tap_action: { action: "more-info" },
        type: "entity",
      });
    }

    if (area.humidity_entity_id) {
      badges.push({
        entity: area.humidity_entity_id,
        state_color: true,
        tap_action: { action: "more-info" },
        type: "entity",
      });
    }

    return {
      cards: [
        {
          badges,
          heading: area.name,
          heading_style: "title",
          icon: area.icon,
          tap_action: tapNavigate(areaPath(area.area_id)),
          type: "heading",
        },
        ...cards,
      ],
      type: "grid",
    };
  });
