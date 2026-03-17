import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig, type HasLightsConfig } from '../config'
import { computeLightAreas, computeLightBadges } from '../helpers/lights'
import { wallboardHeader } from '../helpers/header'

export type WallboardLightsViewStrategyConfig = {
  type: 'custom:wallboard-lights'
} & HasLightsConfig['lights'] & HasAreasConfig

const icon = 'mdi:lightbulb-group'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardLightsViewStrategyConfig = {
    type: 'custom:wallboard-lights',
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
  static async generate(config: WallboardLightsViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
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
        ...wallboardHeader,
      },
      badges,
      max_columns: 3,
      sections: [...areas],
    }
  }
}

customElements.define('ll-strategy-view-wallboard-lights', LightsViewStrategy)
