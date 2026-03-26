import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig, LightsConfig } from "../config";

import { MOBILE_HEADER } from "../helpers/header";
import { computeLightAreas, computeLightBadges } from "../helpers/lights";

export type MobileLightsViewStrategyConfig = {
  type: "custom:mobile-lights";
} & LightsConfig &
  HasAreasConfig;

const icon = "mdi:lightbulb-group";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileLightsViewStrategyConfig = {
    areas: config.areas,
    type: "custom:mobile-lights",
    ...config.overview?.lights,
  };

  return {
    icon,
    path: "lights",
    strategy,
    theme: config.theme,
    title: "Lights",
  };
};

class LightsViewStrategy extends HTMLElement {
  static generate(config: MobileLightsViewStrategyConfig, hass: HomeAssistant): LovelaceViewConfig {
    const badges = computeLightBadges(hass, config);
    const areas = computeLightAreas(hass, config.areas);

    return {
      badges,
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Lights`,
          text_only: true,
          type: "markdown",
        },
        ...MOBILE_HEADER,
      },
      max_columns: 1,
      sections: [...areas],
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-lights", LightsViewStrategy);
