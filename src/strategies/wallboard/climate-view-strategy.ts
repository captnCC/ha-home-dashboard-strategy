import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig } from "../config";

import { computeClimateAreas } from "../helpers/climate";
import { wallboardHeader } from "../helpers/header";

export type WallboardClimateViewStrategyConfig = {
  type: "custom:wallboard-climate";
} & HasAreasConfig;

export const icon = "mdi:thermometer";
export const path = "climate";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardClimateViewStrategyConfig = {
    areas: config.areas,
    type: "custom:wallboard-climate",
  };

  return {
    icon,
    path,
    strategy,
    theme: config.theme,
    title: "Climate",
  };
};

class ClimateViewStrategy extends HTMLElement {
  static generate(
    _config: WallboardClimateViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const areas = computeClimateAreas(hass);

    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Climate`,
          text_only: true,
          type: "markdown",
        },
        ...wallboardHeader,
      },
      max_columns: 3,
      sections: areas,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-climate", ClimateViewStrategy);
