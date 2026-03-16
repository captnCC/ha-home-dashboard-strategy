import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { type Config, type HasAreasConfig } from '../config'

export type MobileSecurityViewStrategyConfig = {
  type: 'custom:mobile-security'
} & HasAreasConfig

const icon = 'mdi:lock-open'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileSecurityViewStrategyConfig = {
    type: 'custom:mobile-security',
    areas: config.areas,
  }

  return {
    icon,
    strategy,
    path: 'security',
    title: 'Security',
    theme: config.theme,
  }
}

class SecurityViewStrategy extends HTMLElement {
  static async generate(_config: MobileSecurityViewStrategyConfig, _hass: HomeAssistant): Promise<LovelaceViewConfig> {
    return {
      type: 'sections',
      sections: [],
    }
  }
}

customElements.define('ll-strategy-view-mobile-security', SecurityViewStrategy)
