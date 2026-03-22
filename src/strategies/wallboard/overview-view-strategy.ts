import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, HasAreasConfig, HasFloorsConfig, OverviewConfig } from "../config";

import { wallboardHeader } from "../helpers/header";
import { mapAreas, mapFloors } from "../helpers/mapping";
import {
  computeAreaCard,
  computeBadges,
  computeFloorSection,
  computePlayingSection,
} from "../helpers/overview";

export type WallboardOverviewViewStrategyConfig = {
  type: "custom:wallboard-overview";
} & OverviewConfig &
  HasAreasConfig &
  HasFloorsConfig;

export const registerView = function registerView(config: Config): LovelaceStrategyViewConfig {
  return {
    icon: "mdi:home",
    path: "overview",
    strategy: {
      areas: config.areas,
      floors: config.floors,
      type: "custom:wallboard-overview",
      ...config.overview,
    },
    theme: config.theme,
  };
};

const computeHeaderCard = function computeHeaderCard(weather: string | null): LovelaceCardConfig {
  const clock = {
    card_mod: {
      style: `
            .time-wrapper {
                align-items: start !important;
            }
          `,
    },
    clock_size: "large",
    clock_style: "digital",
    no_background: true,
    show_seconds: true,
    time_format: "24",
    type: "clock",
  };

  if (weather === null) {
    return clock;
  }

  return {
    cards: [
      clock,
      {
        card_mod: {
          style: `
            ha-card {
              background: none;
              box-shadow: none;
              border: none;
            }
          }`,
        },
        entity: weather,
        forecast_type: "hourly",
        round_temperature: false,
        show_current: false,
        show_forecast: true,
        type: "weather-forecast",
      },
    ],
    columns: 2,
    square: false,
    type: "grid",
  };
};

class OverviewViewStrategy extends HTMLElement {
  static generate(
    config: WallboardOverviewViewStrategyConfig,
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
        card: computeHeaderCard(config.weather || null),
        ...wallboardHeader,
      },
      max_columns: 3,
      sections,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-overview", OverviewViewStrategy);
