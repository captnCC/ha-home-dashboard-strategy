import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'
import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import { type FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { type FloorConfig, type HasAreasConfig } from '../config'

import { computeAreaCard } from './overview'
import { mapAreas } from './mapping'

export const floorPath = (floorId: string) => `floors-${floorId}`

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
