import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { LovelaceConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/types'
import type { LovelaceViewRawConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'

import type { Config } from '../config'

import * as security from './security-view-strategy'
import * as utilities from './utilities-view-strategy'
import * as media from './media-view-strategy'
import * as climate from './climate-view-strategy'
import * as lights from './lights-view-strategy'
import * as area from './area-view-strategy'
import * as floor from './floor-view-strategy'
import * as overview from './overview-view-strategy'

export type MobileDashboardStrategyConfig = {
  type: 'custom:mobile'
} & Config

class DashboardStrategy extends HTMLElement {
  static async generate(
    config: MobileDashboardStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceConfig> {
    const views: LovelaceViewRawConfig[] = [
      overview.registerView(config),
    ]

    if (!(config.lights?.hidden === true))
      views.push(lights.registerView(config))
    if (!(config.climate?.hidden === true))
      views.push(climate.registerView(config))
    if (!(config.security?.hidden === true))
      views.push(security.registerView(config))
    if (!(config.media?.hidden === true))
      views.push(media.registerView(config))
    if (!(config.utility?.hidden === true))
      views.push(utilities.registerView(config))

    const floors = Object.values(hass.floors).map(
      f => floor.registerView(config, f),
    )

    const areas = Object.values(hass.areas).map(
      a => area.registerView(config, a),
    )

    views.push(
      ...floors,
      ...areas,
    )

    return {
      views,
    }
  }
}

customElements.define('ll-strategy-dashboard-mobile', DashboardStrategy)
