import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {LovelaceCardConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/card";

import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";

import {computeAreaTileCardConfig, extendLastCard} from "./cards";
import {mapAreas} from "./mapping";
import {tapNavigate} from "./navigate";
import {areaPath} from "./paths";

export const computeMediaAreas = (hass: HomeAssistant): LovelaceCardConfig[] =>
  mapAreas(hass, {}, (_hass, area): LovelaceCardConfig | null => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);
    const devicesFilter = generateEntityFilter(hass, {
      area: area.area_id,
      domain: ["media_player"],
    });

    const states = Object.keys(hass.states);
    const devices = states
      .filter(devicesFilter)
      .map(computeTileCard)
      .map((card) => ({
        ...card,
        features_position: "bottom",
        show_entity_picture: true,
        state_content: ["media_artist", "media_title", "media_album_name"],
        vertical: false,
      }));

    if (devices.length === 0) {
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
        ...extendLastCard(devices),
      ],
      type: "grid",
    };
  });
