import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { LovelaceConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/types'
import type { LovelaceViewRawConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'

import type { Config } from '../config'
import * as area from '../wallboard/area-view-strategy'
import * as lights from '../wallboard/lights-view-strategy'
import * as climate from '../wallboard/climate-view-strategy'
import * as security from '../wallboard/security-view-strategy'
import * as media from '../wallboard/media-view-strategy'
import * as utilities from '../wallboard/utilities-view-strategy'

import * as overview from './overview-view-strategy'

export type MobileDashboardStrategyConfig = {
  type: 'custom:mobile'
} & Config

class DashboardStrategy extends HTMLElement {
  static async generate(
    config: MobileDashboardStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceConfig> {
    const areas: LovelaceViewRawConfig[] = Object.values(hass.areas).map(
      a => area.registerView(config, a),
    )

    const views: LovelaceViewRawConfig[] = [
      overview.registerView(config),
      lights.registerView(config),
      climate.registerView(config),
      security.registerView(config),
      media.registerView(config),
      utilities.registerView(config),
      ...areas,
    ]

    return {
      views,
    }
  }
}

customElements.define('ll-strategy-dashboard-mobile', DashboardStrategy)
