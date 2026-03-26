import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig } from "../config";

import { wallboardHeader } from "../helpers/header";
import { computeSecurityAreaSections } from "../helpers/security";

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
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Security`,
          text_only: true,
          type: "markdown",
        },
        ...wallboardHeader,
      },
      max_columns: 3,
      sections: computeSecurityAreaSections(hass),
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-security", SecurityViewStrategy);
