import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { AreaConfig, Config } from "../config";

import {
  computeBadges,
  computeClimateSection,
  computeLightSection,
  computeMediaSection,
  computeSecuritySection,
} from "../helpers/area";
import { MOBILE_HEADER } from "../helpers/header";
import { areaPath } from "../helpers/paths";

export type MobileAreaViewStrategyConfig = {
  type: "custom:mobile-area";
  area: string;
} & AreaConfig;

export const registerView = function registerView(
  config: Config,
  area: AreaRegistryEntry,
): LovelaceStrategyViewConfig {
  const strategy: MobileAreaViewStrategyConfig = {
    area: area.area_id,
    type: "custom:mobile-area",
    ...config.areas?.[area.area_id],
  };

  return {
    path: areaPath(area.area_id),
    strategy,
    subview: true,
    theme: config.theme,
    title: area.name,
  };
};

class AreaViewStrategy extends HTMLElement {
  static generate(config: MobileAreaViewStrategyConfig, hass: HomeAssistant): LovelaceViewConfig {
    const area = hass.areas[config.area];

    const header: LovelaceViewHeaderConfig = {
      card: {
        content: `# <ha-icon icon="${area.icon}"></ha-icon> ${area.name}`,
        text_only: true,
        type: "markdown",
      },
      ...MOBILE_HEADER,
    };

    const badges = computeBadges(hass, area, config);

    const sections = [
      ...computeLightSection(hass, area, config.lights || {}),
      ...computeClimateSection(hass, area, config.climate || {}),
      ...computeMediaSection(hass, area),
      ...computeSecuritySection(hass, area),
    ];

    return {
      badges,
      header,
      max_columns: 1,
      sections,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-area", AreaViewStrategy);
