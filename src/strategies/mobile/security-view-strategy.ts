import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig } from "../config";

import { mobileHeader } from "../helpers/header";
import { computeSecurityAreaSections } from "../helpers/security";

export type MobileSecurityViewStrategyConfig = {
  type: "custom:mobile-security";
} & HasAreasConfig;

const icon = "mdi:lock-open";

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileSecurityViewStrategyConfig = {
    areas: config.areas,
    type: "custom:mobile-security",
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
    _config: MobileSecurityViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    return {
      header: {
        card: {
          content: `# <ha-icon icon="${icon}"></ha-icon> Security`,
          text_only: true,
          type: "markdown",
        },
        ...mobileHeader,
      },
      max_columns: 3,
      sections: computeSecurityAreaSections(hass),
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-security", SecurityViewStrategy);
