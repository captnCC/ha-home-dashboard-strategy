import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig, HasLightsConfig } from "../config";

import { WALLBOARD_HEADER } from "../helpers/header";
import { computeLightAreas, computeLightBadges } from "../helpers/lights";

export type WallboardLightsViewStrategyConfig = {
  type: "custom:wallboard-lights";
} & HasLightsConfig["lights"] &
  HasAreasConfig;

const icon = "mdi:lightbulb-group";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardLightsViewStrategyConfig = {
    areas: config.areas,
    type: "custom:wallboard-lights",
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
  static generate(
    config: WallboardLightsViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
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
        ...WALLBOARD_HEADER,
      },
      max_columns: 3,
      sections: [...areas],
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-lights", LightsViewStrategy);
