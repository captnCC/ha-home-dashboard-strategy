import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'
import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import { type FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'
import type { LovelaceBadgeConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/badge'

import { type FloorConfig, type HasAreasConfig } from '../config'
import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'

import { computeAreaCard } from './overview'
import { mapAreas } from './mapping'
import { computeBadge } from './badges'

export const floorPath = (floorId: string) => `floors-${floorId}`

export const computeBadges = (hass: HomeAssistant, floor: FloorRegistryEntry, config: FloorConfig) => {
  const badges: LovelaceBadgeConfig[] = []

  const sceneFilter = generateEntityFilter(hass, {
    floor: floor.floor_id,
    domain: ['scene'],
  })

  const scriptFilter = generateEntityFilter(hass, {
    floor: floor.floor_id,
    domain: ['script'],
  })

  const states = Object.keys(hass.states)

  badges.push(
    ...states.filter(sceneFilter).map(computeBadge),
    ...states.filter(scriptFilter).map(computeBadge),
    ...(config.badges ?? []),
  )

  return badges
}

export const computeAreasSection = (hass: HomeAssistant, floor: FloorRegistryEntry, config: FloorConfig & HasAreasConfig) => {
  const areaCards = mapAreas<LovelaceCardConfig>(
    hass,
    config.areas ?? {},
    computeAreaCard,
    ([_id, area]) => area.floor_id === floor.floor_id
  )

  return {
    type: 'grid',
    column_span: 4,
    cards: areaCards,
  }
}
