import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config } from '../config'
import { computeUtilityAreas } from '../helpers/utilities'
import { mobileHeader } from '../helpers/header'

export type MobileUtilitiesViewStrategyConfig = {
  type: 'custom:mobile-utilities'
}

const icon = 'mdi:cog'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileUtilitiesViewStrategyConfig = {
    type: 'custom:mobile-utilities',
  }

  return {
    icon,
    strategy,
    path: 'utilities',
    title: 'Utilities',
    theme: config.theme,
  }
}

class UtilitiesViewStrategy extends HTMLElement {
  static async generate(_config: MobileUtilitiesViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const areas = computeUtilityAreas(hass)
    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Utilties`,
          text_only: true,
        },
        ...mobileHeader,
      },
      max_columns: 1,
      sections: areas,
    }
  }
}

customElements.define('ll-strategy-view-mobile-utilities', UtilitiesViewStrategy)
