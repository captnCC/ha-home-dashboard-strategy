import type { LovelaceBadgeConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/badge'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'
import { type AreaConfig } from '../config'

import { computeAreaTileCardConfig, generateCardSort, mapAreas } from './cards'
import { tapNavigate } from './navigate'
import { areaPath } from './area'

export const computeClimateAreas = (hass: HomeAssistant, config: Record<string, AreaConfig>) => {
  return mapAreas(hass, config, (area, areaId, config) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name)
    const devicesFilter = generateEntityFilter(hass, {
      area: areaId,
      domain: ['climate', 'fan'],
    })

    const sensorFilter = generateEntityFilter(hass, {
      area: areaId,
      domain: ['sensor'],
      device_class: ['temperature', 'humidity', 'pm25', 'co2', 'aqi'],
    })

    const states = Object.keys(hass.states)

    const cards = [
      ...states.filter(devicesFilter),
      ...states.filter(sensorFilter),
    ]
      .sort(generateCardSort(config.climate?.order))
      .map(computeTileCard)

    if (cards.length === 0) return null

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
          tap_action: tapNavigate(areaPath(areaId)),
          badges,
        },
        ...cards,
      ],
    }
  })
}
