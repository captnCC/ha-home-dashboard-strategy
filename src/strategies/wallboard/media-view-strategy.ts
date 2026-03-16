import type {LovelaceViewConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {computeAreaTileCardConfig, extendLastCard, mapAreas} from "../helpers/cards";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";

export type WallboardMediaViewStrategyConfig = {
  type: "custom:wallboard-media";
};


class MediaViewStrategy extends HTMLElement {
  static async generate(_config: WallboardMediaViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {

    const sections = mapAreas(hass, {}, (area) => {

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
          show_entity_picture: true,
          vertical: false,
          features_position: "bottom",
          state_content: ["media_artist", "media_title", "media_album_name"],
        }));

      if (devices.length === 0) return null;

      return {
        type: "grid",
        cards: [
          {
            type: "heading",
            heading: area.name,
            heading_style: "title",
            icon: area.icon,
            tap_action: {
              action: "navigate",
              navigation_path: `areas-${area.area_id}?historyBack=1`,
            },
          },
          ...extendLastCard(devices),
        ],
      };
    });
    return {
      type: "sections",
      header: {
        card: {
          type: "markdown",
          content: "# <ha-icon icon=\"mdi:play\"></ha-icon> Media",
          text_only: true,
        },
        layout: "start",
        badges_position: "bottom",
        badges_wrap: "wrap",
      },
      max_columns: 3,
      sections,
    };
  }
}


customElements.define("ll-strategy-view-wallboard-media", MediaViewStrategy);