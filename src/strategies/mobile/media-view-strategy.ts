import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig } from "../config";

import { mobileHeader } from "../helpers/header";
import { computeMediaAreas } from "../helpers/media";

export type MobileMediaViewStrategyConfig = {
  type: "custom:mobile-media";
} & HasAreasConfig;

const icon = "mdi:play";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileMediaViewStrategyConfig = {
    areas: config.areas,
    type: "custom:mobile-media",
  };

  return {
    icon,
    path: "media",
    strategy,
    theme: config.theme,
    title: "Media",
  };
};

class MediaViewStrategy extends HTMLElement {
  static generate(_config: MobileMediaViewStrategyConfig, hass: HomeAssistant): LovelaceViewConfig {
    const areas = computeMediaAreas(hass);
    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Media`,
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

customElements.define("ll-strategy-view-mobile-media", MediaViewStrategy);
