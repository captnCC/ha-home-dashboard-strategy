import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig, type HasClimateConfig } from '../config'
import { computeClimateAreas } from '../helpers/climate'
import { mobileHeader } from '../helpers/header'

export type MobileClimateViewStrategyConfig = {
  type: 'custom:mobile-climate'
} & HasAreasConfig & HasClimateConfig

export const icon = 'mdi:thermometer'
export const path = 'climate'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileClimateViewStrategyConfig = {
    type: 'custom:mobile-climate',
    areas: config.areas,
  }

  return {
    icon,
    strategy,
    path,
    title: 'Climate',
    theme: config.theme,
  }
}

class ClimateViewStrategy extends HTMLElement {
  static async generate(config: MobileClimateViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const areas = computeClimateAreas(hass, config.areas)

    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Climate`,
          text_only: true,
        },
        ...mobileHeader,
      },
      max_columns: 1,
      sections: areas,
    }
  }
}

customElements.define('ll-strategy-view-mobile-climate', ClimateViewStrategy)
