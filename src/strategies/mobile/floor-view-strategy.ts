import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { type Config, type FloorConfig, type HasAreasConfig } from '../config'
import { computeAreasSection, floorPath } from '../helpers/floor'

export type MobileFloorViewStrategyConfig = {
  type: 'custom:mobile-floor'
  floor: string
} & FloorConfig & HasAreasConfig

export const registerView = function (config: Config, floor: FloorRegistryEntry): LovelaceStrategyViewConfig {
  const strategy: MobileFloorViewStrategyConfig = {
    type: 'custom:mobile-floor',
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
    config: MobileFloorViewStrategyConfig,
    hass: HomeAssistant,
  ): Promise<LovelaceViewConfig> {
    const floor = hass.floors[config.floor]

    const header: LovelaceViewHeaderConfig = {
      card: {
        type: 'markdown',
        content: `# <ha-icon icon="${floor.icon}"></ha-icon> ${floor.name}`,
        text_only: true,
      },
      layout: 'start',
      badges_position: 'bottom',
      badges_wrap: 'scroll',
    }

    return {
      type: 'sections',
      max_columns: 1,
      header,
      sections: [
        computeAreasSection(hass, floor, config),
      ],
    }
  }
}

customElements.define('ll-strategy-view-mobile-floor', FloorViewStrategy)
