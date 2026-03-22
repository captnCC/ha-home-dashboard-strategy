import type { LovelaceCardConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";

import type {
  Config,
  HasAreasConfig,
  HasBadgesConfig,
  HasFloorsConfig,
  HasLightsConfig,
} from "../config";

import { mobileHeader } from "../helpers/header";
import { mapAreas, mapFloors } from "../helpers/mapping";
import {
  computeAreaCard,
  computeBadges,
  computeFloorSection,
  computePlayingSection,
} from "../helpers/overview";

export type MobileOverviewViewStrategyConfig = {
  type: "custom:mobile-overview";
} & HasFloorsConfig &
  HasAreasConfig &
  HasLightsConfig &
  HasBadgesConfig;

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileOverviewViewStrategyConfig = {
    areas: config.areas,
    floors: config.floors,
    type: "custom:mobile-overview",
    ...config.overview,
  };

  return {
    icon: "mdi:home",
    path: "overview",
    strategy,
    theme: config.theme,
  };
};

class MobileOverviewViewStrategy extends HTMLElement {
  static generate(
    config: MobileOverviewViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const sections = [computePlayingSection(hass)];

    if (config.floors === false) {
      const card = {
        cards: [
          {
            heading: "Areas",
            heading_style: "title",
            icon: "mdi:floor-plan",
            type: "heading",
          },
          ...mapAreas<LovelaceCardConfig>(hass, config.areas ?? {}, computeAreaCard),
        ],
        column_span: 4,
        type: "grid",
      };
      sections.push(card);
    } else {
      sections.push(...mapFloors<LovelaceCardConfig>(hass, config, computeFloorSection));
    }

    return {
      badges: computeBadges(hass, config),
      header: {
        ...mobileHeader,
      },
      max_columns: 1,
      sections,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-overview", MobileOverviewViewStrategy);
