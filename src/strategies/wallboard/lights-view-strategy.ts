import type {LovelaceViewConfig,} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {computeAreaTileCardConfig, extendLastCard, mapAreas,} from "../helpers/cards";
import type {LovelaceCardConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import {AreaConfig, HasAreasConfig, HasLightsConfig} from "../config";
import {computeBadge} from "../helpers/badges";
import {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";

export type WallboardLightsViewStrategyConfig = {
  type: "custom:wallboard-lights";
} & HasLightsConfig["lights"] & HasAreasConfig;


class LightsViewStrategy extends HTMLElement {
  static async generate(config: WallboardLightsViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {

    const allEntities = Object.keys(hass.states);

    const areas = mapAreas<LovelaceCardConfig>(hass, config.areas || {}, (area) => {
      const computeTileCard = computeAreaTileCardConfig(hass, area.name);

      const areaFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["light"],
      });

      const lightIds = allEntities.filter(areaFilter);

      if (lightIds.length === 0) return null;

      const cards = extendLastCard(lightIds.map(computeTileCard));

      const badges: EntityBadgeConfig[] = [];
      const areaConf = config.areas ? config.areas[area.area_id] : undefined;
      const allLights = areaConf?.lights?.all;
      if (allLights) {
        badges.push(computeBadge(allLights));
      }

      return {
        type: "grid",
        cards: [
          {
            type: "heading",
            heading_style: "title",
            heading: area.name,
            icon: area.icon,
            tap_action: {
              action: "navigate",
              navigation_path: `areas-${area.area_id}?historyBack=1`,
            },
            badges,
          },
          ...cards,
        ],
      };
    });


    const badges: EntityBadgeConfig[] = [];

    if (config.all) {
      badges.push(computeBadge(config.all));
    }

    return {
      type: "sections",
      header: {
        card: {
          type: "markdown",
          content: "# <ha-icon icon=\"mdi:home-lightbulb-outline\"></ha-icon> Lights",
          text_only: true,
        },
        layout: "responsive",
        badges_position: "bottom",
        badges_wrap: "scroll",
      },
      badges,
      max_columns: 3,
      sections: [...areas],
    };
  }
}


customElements.define("ll-strategy-view-wallboard-lights", LightsViewStrategy);
