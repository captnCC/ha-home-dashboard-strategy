import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'
import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { computeAreaCard, computeBadges, computeFloorSection, computePlayingSection } from '../helpers/overview'
import { type Config, type HasAreasConfig, type HasFloorsConfig, type OverviewConfig } from '../config'
import { mapAreas, mapFloors } from '../helpers/mapping'
import { wallboardHeader } from '../helpers/header'

export type WallboardOverviewViewStrategyConfig = {
  type: 'custom:wallboard-overview'
} & OverviewConfig & HasAreasConfig & HasFloorsConfig

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  return {
    icon: 'mdi:home',
    path: 'overview',
    strategy: {
      type: 'custom:wallboard-overview',
      areas: config.areas,
      floors: config.floors,
      ...config.overview,
    },
    theme: config.theme,
  }
}

class OverviewViewStrategy extends HTMLElement {
  static async generate(
    config: WallboardOverviewViewStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceViewConfig> {
    const sections = [computePlayingSection(hass)]

    if (config.floors !== false) {
      sections.push(...mapFloors<LovelaceCardConfig>(
        hass,
        config,
        computeFloorSection,
      ))
    }
    else {
      const card = {
        type: 'grid',
        column_span: 4,
        cards: [
          {
            type: 'heading',
            heading: 'Areas',
            heading_style: 'title',
            icon: 'mdi:floor-plan',
          },
          ...mapAreas<LovelaceCardConfig>(
            hass,
            config.areas ?? {},
            computeAreaCard,
          ),
        ],
      }
      sections.push(card)
    }

    return {
      type: 'sections',
      max_columns: 3,
      header: {
        card: computeHeaderCard(config.weather || null),
        ...wallboardHeader,
      },
      badges: computeBadges(hass, config),
      sections,
    }
  }
}

const computeHeaderCard = function (weather: string | null): LovelaceCardConfig {
  const clock = {
    type: 'clock',
    clock_style: 'digital',
    clock_size: 'large',
    time_format: '24',
    show_seconds: true,
    no_background: true,
    card_mod: {
      style: `
            .time-wrapper {
                align-items: start !important;
            }
          `,
    },
  }

  if (weather === null) {
    return clock
  }

  return {
    type: 'grid',
    square: false,
    columns: 2,
    cards: [
      clock,
      {
        show_current: false,
        show_forecast: true,
        type: 'weather-forecast',
        entity: weather,
        forecast_type: 'hourly',
        round_temperature: false,
        card_mod: {
          style: `
            ha-card {
              background: none;
              box-shadow: none;
              border: none;
            }
          }`,
        },
      },
    ],
  }
}

customElements.define('ll-strategy-view-wallboard-overview', OverviewViewStrategy)
