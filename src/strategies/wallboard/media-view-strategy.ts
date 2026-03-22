import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";

import type { Config, HasAreasConfig } from "../config";

import { wallboardHeader } from "../helpers/header";
import { computeMediaAreas } from "../helpers/media";

export type WallboardMediaViewStrategyConfig = {
  type: "custom:wallboard-media";
} & HasAreasConfig;

const icon = "mdi:play";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardMediaViewStrategyConfig = {
    areas: config.areas,
    type: "custom:wallboard-media",
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
  static generate(
    _config: WallboardMediaViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const areas = computeMediaAreas(hass);
    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Media`,
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

customElements.define("ll-strategy-view-wallboard-media", MediaViewStrategy);
