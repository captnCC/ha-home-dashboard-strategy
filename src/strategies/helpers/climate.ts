import type { LovelaceBadgeConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/badge'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'

import { computeAreaTileCardConfig, mapAreas } from './cards'
import { tapNavigate } from './navigate'
import { areaPath } from './area'

export const computeClimateAreas = (hass: HomeAssistant) => {
  return mapAreas(hass, {}, (area) => {
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
}
