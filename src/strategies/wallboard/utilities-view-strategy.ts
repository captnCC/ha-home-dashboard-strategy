import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config } from '../config'
import { computeUtilityAreas } from '../helpers/utilities'
import { wallboardHeader } from '../helpers/header'

export type WallboardUtilitiesViewStrategyConfig = {
  type: 'custom:wallboard-utilities'
}

const icon = 'mdi:cog'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardUtilitiesViewStrategyConfig = {
    type: 'custom:wallboard-utilities',
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
  static async generate(_config: WallboardUtilitiesViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const areas = computeUtilityAreas(hass)
    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Utilties`,
          text_only: true,
        },
        ...wallboardHeader,
      },
      max_columns: 3,
      sections: areas,
    }
  }
}

customElements.define('ll-strategy-view-wallboard-utilities', UtilitiesViewStrategy)
