import type {LovelaceViewConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import {computeAreaTileCardConfig, mapAreas} from "../helpers/cards";
import type {LovelaceBadgeConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/badge";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";

export type WallboardClimateViewStrategyConfig = {
  type: "custom:wallboard-climate";
};

class ClimateViewStrategy extends HTMLElement {
  static async generate(_config: WallboardClimateViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const sections = mapAreas(hass, {}, (area) => {

      const computeTileCard = computeAreaTileCardConfig(hass, area.name);
      const devicesFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["climate", "fan"],
      });

      const sensorFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["sensor"],
        device_class: ["temperature", "humidity", "pm25", "co2", "aqi"],
      });

      const allEntities = Object.keys(hass.states);
      const devices = allEntities.filter(devicesFilter).map(computeTileCard);
      const sensors = allEntities.filter(sensorFilter).map(computeTileCard);

      if (devices.length + sensors.length === 0) return null;


      const badges: LovelaceBadgeConfig[] = [];

      if (area.temperature_entity_id) {
        badges.push({
          type: "entity",
          entity: area.temperature_entity_id,
          state_color: true,
          tap_action: {action: "more-info"}
        });
      }

      if (area.humidity_entity_id) {
        badges.push({
          type: "entity",
          entity: area.humidity_entity_id,
          state_color: true,
          tap_action: {action: "more-info"}
        });
      }

      return {
        type: "grid",
        cards: [
          {
            type: "heading",
            heading: area.name,
            heading_style: "title",
            icon: area.icon,
            navigation_path: `areas-${area.area_id}`,
            tap_action: {
              action: "navigate",
              navigation_path: `areas-${area.area_id}?historyBack=1`,
            },
            badges,
          },
          ...devices,
          ...sensors,
        ],
      };
    });

    return {
      type: "sections",
      header: {
        card: {
          type: "markdown",
          content: "# <ha-icon icon=\"mdi:home-thermometer-outline\"></ha-icon> Climate",
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


customElements.define("ll-strategy-view-wallboard-climate", ClimateViewStrategy);
