import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { AreaRegistryEntry } from 'home-assistant-frontend-types/frontend/data/area/area_registry'

import { type AreaConfig, type Config } from '../config'
import * as areaHelpers from '../helpers/area'
import { areaPath } from '../helpers/area'
import { wallboardHeader } from '../helpers/header'

export type WallboardAreaViewStrategyConfig = {
  type: 'custom:wallboard-area'
  area: string
} & AreaConfig

export const registerView = function (config: Config, area: AreaRegistryEntry): LovelaceStrategyViewConfig {
  const strategy: WallboardAreaViewStrategyConfig = {
    type: 'custom:wallboard-area',
    area: area.area_id,
    ...config.areas?.[area.area_id],
  }

  return {
    strategy,
    path: areaPath(area.area_id),
    title: area.name,
    subview: true,
    theme: config.theme,
  }
}

class AreaViewStrategy extends HTMLElement {
  static async generate(
    config: WallboardAreaViewStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceViewConfig> {
    const area = hass.areas[config.area]

    const header: LovelaceViewHeaderConfig = {
      card: {
        type: 'markdown',
        content: `# <ha-icon icon="${area.icon}"></ha-icon> ${area.name}`,
        text_only: true,
      },
      ...wallboardHeader,
    }

    const badges = areaHelpers.computeBadges(hass, area, config)

    if (config.badges) {
      badges.push(...config.badges)
    }

    const sections = [
      ...areaHelpers.computeLightSection(hass, area, config.lights || {}),
      ...areaHelpers.computeClimateSection(hass, area, config.climate || {}),
      ...areaHelpers.computeMediaSection(hass, area),
    ]

    return {
      type: 'sections',
      max_columns: 3,
      header,
      badges,
      sections,
    }
  }
}

customElements.define('ll-strategy-view-wallboard-area', AreaViewStrategy)
