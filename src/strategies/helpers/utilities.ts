import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {LovelaceCardConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/card";

import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";

import {computeAreaTileCardConfig} from "./cards";
import {mapAreas} from "./mapping";
import {tapNavigate} from "./navigate";
import {areaPath} from "./paths";

export const computeUtilityAreas = (hass: HomeAssistant): LovelaceCardConfig[] => {
  const states = Object.keys(hass.states);
  return mapAreas(hass, {}, (_hass, area): LovelaceCardConfig | null => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const vacuums = states
      .filter(generateEntityFilter(hass, { area: area.area_id, domain: "vacuum" }))
      .map(computeTileCard);

    const batteries = states
      .filter(
        generateEntityFilter(hass, {
          area: area.area_id,
          device_class: "battery",
          domain: "sensor",
        }),
      )
      .map(computeTileCard);

    if (vacuums.length + batteries.length === 0) {
      return null;
    }

    return {
      cards: [
        {
          heading: area.name,
          heading_style: "title",
          icon: area.icon,
          tap_action: tapNavigate(areaPath(area.area_id)),
          type: "heading",
        },
        ...vacuums,
        ...batteries,
      ],
      type: "grid",
    };
  });
};
