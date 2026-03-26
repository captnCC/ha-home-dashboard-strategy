import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig, HasClimateConfig } from "../config";

import { computeClimateAreas } from "../helpers/climate";
import { MOBILE_HEADER } from "../helpers/header";

export type MobileClimateViewStrategyConfig = {
  type: "custom:mobile-climate";
} & HasAreasConfig &
  HasClimateConfig;

export const icon = "mdi:thermometer";
export const path = "climate";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileClimateViewStrategyConfig = {
    areas: config.areas,
    type: "custom:mobile-climate",
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
    config: MobileClimateViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const areas = computeClimateAreas(hass, config.areas);

    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Climate`,
          text_only: true,
          type: "markdown",
        },
        ...MOBILE_HEADER,
      },
      max_columns: 1,
      sections: areas,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-climate", ClimateViewStrategy);
