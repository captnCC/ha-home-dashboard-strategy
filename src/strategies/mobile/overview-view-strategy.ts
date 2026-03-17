import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'

import {
  type Config,
  type HasAreasConfig,
  type HasBadgesConfig,
  type HasFloorsConfig,
  type HasLightsConfig,
} from '../config'
import { computeBadges, computeFloorSection, computePlayingSection } from '../helpers/overview'
import { mapFloors } from '../helpers/mapping'
import { mobileHeader } from '../helpers/header'

export type MobileOverviewViewStrategyConfig = {
  type: 'custom:mobile-overview'
} & HasFloorsConfig & HasAreasConfig & HasLightsConfig & HasBadgesConfig

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileOverviewViewStrategyConfig = {
    type: 'custom:mobile-overview',
    areas: config.areas,
    floors: config.floors,
    ...config.overview,
  }

  return {
    strategy,
    icon: 'mdi:home',
    path: 'overview',
    theme: config.theme,
  }
}

class MobileOverviewViewStrategy extends HTMLElement {
  static async generate(
    config: MobileOverviewViewStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceViewConfig> {
    return {
      type: 'sections',
      max_columns: 1,
      header: {
        ...mobileHeader,
      },
      badges: computeBadges(hass, config),
      sections: [
        computePlayingSection(hass),
        ...mapFloors<LovelaceCardConfig>(hass, config, computeFloorSection),
      ],
    }
  }
}

customElements.define('ll-strategy-view-mobile-overview', MobileOverviewViewStrategy)
