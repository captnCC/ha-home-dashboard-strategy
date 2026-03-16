import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import {Config, HasAreasConfig, HasBadgesConfig, HasLightsConfig} from "../config";
import {computeAreasSection, computeBadges, computePlayingSection} from "../helpers/overview";

export type MobileOverviewViewStrategyConfig = {
  type: "custom:mobile-overview";
} & HasAreasConfig & HasLightsConfig & HasBadgesConfig;

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileOverviewViewStrategyConfig = {
    type: "custom:mobile-overview",
    areas: config.areas,
    ...config.overview,
  };

  return {
    strategy,
    icon: "mdi:home",
    path: "overview",
    theme: config.theme,
  };
};

class MobileOverviewViewStrategy extends HTMLElement {
  static async generate(
    config: MobileOverviewViewStrategyConfig,
    hass: HomeAssistant
  ): Promise<LovelaceViewConfig> {

    return {
      type: "sections",
      max_columns: 1,
      header: {
        layout: "responsive",
        badges_position: "bottom",
        badges_wrap: "scroll",
      },
      badges: computeBadges(hass, config),
      sections: [
        computePlayingSection(hass),
        computeAreasSection(hass, config.areas || {}),
      ],
    };
  }
}

customElements.define("ll-strategy-view-mobile-overview", MobileOverviewViewStrategy);
