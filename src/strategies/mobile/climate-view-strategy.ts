import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig } from '../config'
import { computeClimateAreas } from '../helpers/climate'

export type MobileClimateViewStrategyConfig = {
  type: 'custom:mobile-climate'
} & HasAreasConfig

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
  static async generate(_config: MobileClimateViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const areas = computeClimateAreas(hass)

    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Climate`,
          text_only: true,
        },
        layout: 'start',
        badges_position: 'bottom',
        badges_wrap: 'scroll',
      },
      max_columns: 1,
      sections: areas,
    }
  }
}

customElements.define('ll-strategy-view-mobile-climate', ClimateViewStrategy)
