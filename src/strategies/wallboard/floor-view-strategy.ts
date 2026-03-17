import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { type Config, type FloorConfig, type HasAreasConfig } from '../config'
import { computeAreasSection, computeBadges, floorPath } from '../helpers/floor'
import { wallboardHeader } from '../helpers/header'

export type WallboardFloorViewStrategyConfig = {
  type: 'custom:wallboard-floor'
  floor: string
} & FloorConfig & HasAreasConfig

export const registerView = function (config: Config, floor: FloorRegistryEntry): LovelaceStrategyViewConfig {
  const strategy: WallboardFloorViewStrategyConfig = {
    type: 'custom:wallboard-floor',
    floor: floor.floor_id,
    areas: config.areas,
    ...config.floors?.[floor.floor_id],
  }

  return {
    strategy,
    path: floorPath(floor.floor_id),
    title: floor.name,
    subview: true,
    theme: config.theme,
  }
}

class FloorViewStrategy extends HTMLElement {
  static async generate(
    config: WallboardFloorViewStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceViewConfig> {
    const floor = hass.floors[config.floor]

    const header: LovelaceViewHeaderConfig = {
      card: {
        type: 'markdown',
        content: `# <ha-icon icon="${floor.icon || 'mdi:floor-plan'}"></ha-icon> ${floor.name}`,
        text_only: true,
      },
      ...wallboardHeader,
    }

    return {
      type: 'sections',
      max_columns: 3,
      header,
      badges: computeBadges(hass, floor, config),
      sections: [
        computeAreasSection(hass, floor, config),
      ],
    }
  }
}

customElements.define('ll-strategy-view-wallboard-floor', FloorViewStrategy)
