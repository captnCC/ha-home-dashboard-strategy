import type { LovelaceStrategyViewConfig, LovelaceViewConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'
import type { LovelaceBadgeConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/badge'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { computeAreaTileCardConfig, mapAreas } from '../helpers/cards'
import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'
import { type Config, type HasAreasConfig } from '../config'
import { tapNavigate } from '../helpers/navigate'

import { areaPath } from './area-view-strategy'

export type WallboardClimateViewStrategyConfig = {
  type: 'custom:wallboard-climate'
} & HasAreasConfig

export const icon = 'mdi:thermometer'
export const path = 'climate'

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: WallboardClimateViewStrategyConfig = {
    type: 'custom:wallboard-climate',
    areas: config.areas,
  }

  return {
    icon,
    strategy,
    path,
    title: 'Climate',
    theme: config.theme,
  }
}

class ClimateViewStrategy extends HTMLElement {
  static async generate(_config: WallboardClimateViewStrategyConfig, hass: HomeAssistant): Promise<LovelaceViewConfig> {
    const sections = mapAreas(hass, {}, (area) => {
      const computeTileCard = computeAreaTileCardConfig(hass, area.name)
      const devicesFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ['climate', 'fan'],
      })

      const sensorFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ['sensor'],
        device_class: ['temperature', 'humidity', 'pm25', 'co2', 'aqi'],
      })

      const allEntities = Object.keys(hass.states)
      const devices = allEntities.filter(devicesFilter).map(computeTileCard)
      const sensors = allEntities.filter(sensorFilter).map(computeTileCard)

      if (devices.length + sensors.length === 0) return null

      const badges: LovelaceBadgeConfig[] = []

      if (area.temperature_entity_id) {
        badges.push({
          type: 'entity',
          entity: area.temperature_entity_id,
          state_color: true,
          tap_action: { action: 'more-info' },
        })
      }

      if (area.humidity_entity_id) {
        badges.push({
          type: 'entity',
          entity: area.humidity_entity_id,
          state_color: true,
          tap_action: { action: 'more-info' },
        })
      }

      return {
        type: 'grid',
        cards: [
          {
            type: 'heading',
            heading: area.name,
            heading_style: 'title',
            icon: area.icon,
            tap_action: tapNavigate(areaPath(area.area_id)),
            badges,
          },
          ...devices,
          ...sensors,
        ],
      }
    })

    return {
      type: 'sections',
      header: {
        card: {
          type: 'markdown',
          content: `# <ha-icon icon="${icon}"></ha-icon> Climate`,
          text_only: true,
        },
        layout: 'start',
        badges_position: 'bottom',
        badges_wrap: 'wrap',
      },
      max_columns: 3,
      sections,
    }
  }
}

customElements.define('ll-strategy-view-wallboard-climate', ClimateViewStrategy)
