import type {FloorRegistryEntry} from "home-assistant-frontend-types/frontend/data/floor_registry";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {Config, FloorConfig, HasAreasConfig} from "../config";

import {computeAreasSection, computeBadges, getFloorConfig} from "../helpers/floor";
import {wallboardHeader} from "../helpers/header";
import {floorPath} from "../helpers/paths";

export type WallboardFloorViewStrategyConfig = {
  type: "custom:wallboard-floor";
  floor: string;
} & FloorConfig &
  HasAreasConfig;

export const registerView = function registerView(
  config: Config,
  floor: FloorRegistryEntry,
): LovelaceStrategyViewConfig {
  const floorCfg = getFloorConfig(config, floor.floor_id);
  const strategy: WallboardFloorViewStrategyConfig = {
    areas: config.areas,
    floor: floor.floor_id,
    type: "custom:wallboard-floor",
    ...floorCfg,
  };

  return {
    path: floorPath(floor.floor_id),
    strategy,
    subview: true,
    theme: config.theme,
    title: floor.name,
  };
};

class FloorViewStrategy extends HTMLElement {
  static generate(
    config: WallboardFloorViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const floor = hass.floors[config.floor];

    const header: LovelaceViewHeaderConfig = {
      card: {
        content: `# <ha-icon icon="${floor.icon || "mdi:floor-plan"}"></ha-icon> ${floor.name}`,
        text_only: true,
        type: "markdown",
      },
      ...wallboardHeader,
    };

    return {
      badges: computeBadges(hass, floor, config),
      header,
      max_columns: 3,
      sections: [computeAreasSection(hass, floor, config)],
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-floor", FloorViewStrategy);
