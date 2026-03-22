import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";

import type { Config } from "../config";

import { mobileHeader } from "../helpers/header";
import { computeUtilityAreas } from "../helpers/utilities";

export interface MobileUtilitiesViewStrategyConfig {
  type: "custom:mobile-utilities";
}

const icon = "mdi:cog";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileUtilitiesViewStrategyConfig = {
    type: "custom:mobile-utilities",
  };

  return {
    icon,
    path: "utilities",
    strategy,
    theme: config.theme,
    title: "Utilities",
  };
};

class UtilitiesViewStrategy extends HTMLElement {
  static generate(
    _config: MobileUtilitiesViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const areas = computeUtilityAreas(hass);
    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Utilties`,
          text_only: true,
          type: "markdown",
        },
        ...mobileHeader,
      },
      max_columns: 1,
      sections: areas,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-utilities", UtilitiesViewStrategy);
