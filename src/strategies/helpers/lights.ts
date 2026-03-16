import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'
import type { EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'
import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'
import { type AreaConfig, type HasLightsConfig } from '../config'

import { computeBadge } from './badges'
import { tapNavigate } from './navigate'
import { computeAreaTileCardConfig, extendLastCard, mapAreas } from './cards'
import { areaPath } from './area'

export const computeLightBadges = (hass: HomeAssistant, config: HasLightsConfig['lights'] = {}) => {
  const badges: EntityBadgeConfig[] = []
  if (config.all) {
    badges.push(computeBadge(config.all))
  }
  return badges
}

export const computeLightAreas = (hass: HomeAssistant, areas: Record<string, AreaConfig> = {}) => {
  const states = Object.keys(hass.states)
  return mapAreas<LovelaceCardConfig>(hass, areas, (area) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name)

    const areaFilter = generateEntityFilter(hass, {
      area: area.area_id,
      domain: ['light'],
    })

    const lightIds = states.filter(areaFilter)

    if (lightIds.length === 0) return null

    const cards = extendLastCard(lightIds.map(computeTileCard))

    const badges: EntityBadgeConfig[] = []
    const areaConf = areas[area.area_id] ?? undefined
    const allLights = areaConf?.lights?.all
    if (allLights) {
      badges.push(computeBadge(allLights))
    }

    return {
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading_style: 'title',
          heading: area.name,
          icon: area.icon,
          tap_action: tapNavigate(areaPath(area.area_id)),
          badges,
        },
        ...cards,
      ],
    }
  })
}
