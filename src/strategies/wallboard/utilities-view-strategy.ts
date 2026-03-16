import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {Config} from "../config";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";
import {computeAreaTileCardConfig, mapAreas} from "../helpers/cards";
import {tapNavigate} from "../helpers/navigate";
import {areaPath} from "./area-view-strategy";

export type WallboardUtilitiesViewStrategyConfig = {
  type: "custom:wallboard-utilities";
};

const icon = "mdi:cog";

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardUtilitiesViewStrategyConfig = {
    type: "custom:wallboard-utilities",
  };

  return {
    icon,
    strategy,
    path: "utilities",
    title: "Utilities",
    theme: config.theme,
  };
};

class UtilitiesViewStrategy extends HTMLElement {
  static async generate(_config: WallboardUtilitiesViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {

    const states = Object.keys(hass.states);


    generateEntityFilter(hass, {domain: "sensor", device_class: "battery"});

    const areas = mapAreas(hass, {}, (area) => {

      const computeTileCard = computeAreaTileCardConfig(hass, area.name);

      const vacuums = states
        .filter(generateEntityFilter(hass, {area: area.area_id, domain: "vacuum"}))
        .map(computeTileCard);

      const batteries = states
        .filter(generateEntityFilter(hass, {area: area.area_id, domain: "sensor", device_class: "battery"}))
        .map(computeTileCard);


      if(vacuums.length + batteries.length === 0){
        return null;
      }

      return {
        type: "grid",
        cards: [
          {
            type: "heading",
            heading: area.name,
            heading_style: "title",
            icon: area.icon,
            tap_action: tapNavigate(areaPath(area.area_id)),
          },
          ...vacuums,
          ...batteries,
        ]
      };
    });


    return {
      type: "sections",
      header: {
        card: {
          type: "markdown",
          content: `# <ha-icon icon="${icon}"></ha-icon> Utilties`,
          text_only: true,
        },
        layout: "start",
        badges_position: "bottom",
        badges_wrap: "wrap",
      },
      max_columns: 3,
      sections: areas,
    };
  }
}

customElements.define("ll-strategy-view-wallboard-utilities", UtilitiesViewStrategy);