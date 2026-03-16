import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig, type HasLightsConfig } from '../config'
import { computeLightAreas, computeLightBadges } from '../helpers/lights'

export type MobileLightsViewStrategyConfig = {
  type: 'custom:mobile-lights'
} & HasLightsConfig['lights'] & HasAreasConfig

const icon = 'mdi:lightbulb-group'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileLightsViewStrategyConfig = {
    type: 'custom:mobile-lights',
    areas: config.areas,
    ...config.overview?.lights,
  }

  return {
    icon,
    strategy,
    path: 'lights',
    title: 'Lights',
    theme: config.theme,
  }
}

class LightsViewStrategy extends HTMLElement {
  static async generate(config: MobileLightsViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const badges = computeLightBadges(hass, config)
    const areas = computeLightAreas(hass, config.areas)

    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Lights`,
          text_only: true,
        },
        layout: 'responsive',
        badges_position: 'bottom',
        badges_wrap: 'scroll',
      },
      badges,
      max_columns: 1,
      sections: [...areas],
    }
  }
}

customElements.define('ll-strategy-view-mobile-lights', LightsViewStrategy)
