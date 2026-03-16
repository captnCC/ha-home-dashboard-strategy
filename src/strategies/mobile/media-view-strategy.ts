import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig } from '../config'
import { computeMediaAreas } from '../helpers/media'

export type MobileMediaViewStrategyConfig = {
  type: 'custom:mobile-media'
} & HasAreasConfig

const icon = 'mdi:play'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileMediaViewStrategyConfig = {
    type: 'custom:mobile-media',
    areas: config.areas,
  }

  return {
    icon,
    strategy,
    path: 'media',
    title: 'Media',
    theme: config.theme,
  }
}

class MediaViewStrategy extends HTMLElement {
  static async generate(_config: MobileMediaViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const areas = computeMediaAreas(hass)
    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Media`,
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

customElements.define('ll-strategy-view-mobile-media', MediaViewStrategy)
