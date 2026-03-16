import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {Config, HasAreasConfig} from "../config";

export type WallboardSecurityViewStrategyConfig = {
  type: "custom:wallboard-security";
} & HasAreasConfig;

const icon = "mdi:lock-open";

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardSecurityViewStrategyConfig = {
    type: "custom:wallboard-security",
    areas: config.areas,
  };

  return {
    icon,
    strategy,
    path: "security",
    title: "Security",
    theme: config.theme,
  };
};

class SecurityViewStrategy extends HTMLElement {
  static async generate(_config: WallboardSecurityViewStrategyConfig, _hass: HomeAssistant): Promise<LovelaceViewConfig> {
    return {
      type: "sections",
      sections: []
    };
  }
}

customElements.define("ll-strategy-view-wallboard-security", SecurityViewStrategy);