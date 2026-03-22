import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";

import type { Config, HasAreasConfig } from "../config";

export type WallboardSecurityViewStrategyConfig = {
  type: "custom:wallboard-security";
} & HasAreasConfig;

const icon = "mdi:lock-open";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardSecurityViewStrategyConfig = {
    areas: config.areas,
    type: "custom:wallboard-security",
  };

  return {
    icon,
    path: "security",
    strategy,
    theme: config.theme,
    title: "Security",
  };
};

class SecurityViewStrategy extends HTMLElement {
  static generate(
    _config: WallboardSecurityViewStrategyConfig,
    _hass: HomeAssistant,
  ): LovelaceViewConfig {
    return {
      sections: [],
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-security", SecurityViewStrategy);
