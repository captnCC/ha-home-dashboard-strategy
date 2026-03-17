import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { type AreaConfig, type Config } from '../config'
import { computeAreasSection, floorPath } from '../helpers/floor'

export type WallboardFloorViewStrategyConfig = {
  type: 'custom:wallboard-floor'
  floor: string
  areas?: Record<string, AreaConfig>
}

export const registerView = function (config: Config, floor: FloorRegistryEntry): LovelaceStrategyViewConfig {
  const strategy: WallboardFloorViewStrategyConfig = {
    type: 'custom:wallboard-floor',
    floor: floor.floor_id,
    areas: config.areas,
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
      layout: 'start',
      badges_position: 'bottom',
      badges_wrap: 'wrap',
    }

    return {
      type: 'sections',
      max_columns: 3,
      header,
      sections: [
        computeAreasSection(hass, floor, config),
      ],
    }
  }
}

customElements.define('ll-strategy-view-wallboard-floor', FloorViewStrategy)
