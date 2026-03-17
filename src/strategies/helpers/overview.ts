import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import { type LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'
import { type StateCondition } from 'home-assistant-frontend-types/frontend/panels/lovelace/common/validate-condition'
import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'
import { type AreaRegistryEntry } from 'home-assistant-frontend-types/frontend/data/area/area_registry'
import { type FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'
import { type AreaConfig, type FloorConfig, type HasAreasConfig, type OverviewConfig } from '../config'

import { computeAreaTileCardConfig, generateCardSort } from './cards'
import { computeBadge } from './badges'
import { areaPath } from './area'
import { navigate, tapNavigate } from './navigate'
import { floorPath } from './floor'
import { type FloorCallback, mapAreas } from './mapping'

export const computeBadges = function (hass: HomeAssistant, config: OverviewConfig): EntityBadgeConfig[] {
  const states = Object.keys(hass.states)

  const badges: EntityBadgeConfig[] = []

  if (config.lights?.all) {
    badges.push(computeBadge(config.lights.all))
  }

  const scenesFilter = generateEntityFilter(hass, {
    domain: ['scene'],
    label: 'overview',
  })

  const scriptFilter = generateEntityFilter(hass, {
    domain: ['script'],
    label: 'overview',
  })

  badges.push(
    ...states.filter(scenesFilter).map(computeBadge),
    ...states.filter(scriptFilter).map(computeBadge),
  )

  if (config.badges) {
    badges.push(...config.badges)
  }

  return badges
}

export const computePlayingSection = function (hass: HomeAssistant): LovelaceCardConfig {
  const filter = generateEntityFilter(hass, {
    domain: ['media_player'],
  })

  const cardGenerator = computeAreaTileCardConfig(hass, '')
  const players = Object.keys(hass.states).filter(filter)
  const cards = players.map(
    (entity): LovelaceCardConfig => ({
      ...cardGenerator(entity),
      grid_options: {
        columns: 12,
        rows: 1,
      },
      show_entity_picture: true,
      vertical: false,
      features_position: 'inline',
      state_content: ['media_artist', 'media_title', 'media_album_name'],
      visibility: [
        {
          condition: 'state',
          entity: entity,
          state: 'playing',
        },
      ],
    }),
  )

  const conditions = players.map(
    (entity): StateCondition => ({
      condition: 'state',
      entity: entity,
      state: 'playing',
    }),
  )

  return {
    type: 'grid',
    column_span: 3,
    visibility: [
      {
        condition: 'or',
        conditions,
      },
    ],

    cards: [
      {
        type: 'heading',
        heading: 'Playing',
        heading_style: 'title',
        icon: 'mdi:play',
      },
      ...cards,
    ],
  }
}

export const computeAreaCard = (hass: HomeAssistant, area: AreaRegistryEntry, areaId: string, config: AreaConfig) => {
  if (config.hidden) return null

  const size = config.size ?? 'large'

  const cardCompute = computeAreaTileCardConfig(hass, area.name)

  const filter = generateEntityFilter(hass, {
    area: areaId,
    label: 'overview',
    domain: ['light'],
  })

  const sort = generateCardSort(config.lights?.order)

  const overviewCards = size === 'large'
    ? Object.keys(hass.states)
        .filter(filter)
        .sort(sort)
        .map(
          entity => ({
            ...cardCompute(entity),
            features_position: 'inline',
          }),
        )
    : []

  const features = [
    {
      type: 'area-controls',
      controls: ['light', 'fan'],
    },
  ]

  return {
    type: 'custom:vertical-stack-in-card',
    column_span: size === 'large' ? 2 : 1,
    grid_options: {
      columns: size === 'large' ? 12 : 6,
    },
    cards: [
      {
        type: 'area',
        area: areaId,
        features,
        features_position: size === 'large' ? 'inline' : 'bottom',
        display_type: 'compact',
        alert_classes: ['motion', 'moisture'],
        sensor_classes: ['temperature', 'humidity'],
        navigation_path: navigate(areaPath(areaId)),
        card_mod: {
          style: `
              ha-card {
                background: none;
                box-shadow: none;
                border: none;
              }
            }`,
        },
      },
      ...overviewCards,
    ],
  }
}

export const computeFloorSection: FloorCallback<LovelaceCardConfig> = function (hass: HomeAssistant, floor: FloorRegistryEntry, config: FloorConfig & HasAreasConfig) {
  const areaCards = mapAreas<LovelaceCardConfig>(
    hass,
    config.areas ?? {},
    computeAreaCard,
    ([_id, area]) => area.floor_id === floor.floor_id
  )

  return {
    type: 'grid',
    column_span: 4,
    cards: [
      {
        type: 'heading',
        heading: floor.name,
        heading_style: 'title',
        icon: floor.icon ?? 'mdi:home',
        tap_action: tapNavigate(floorPath(floor.floor_id)),
      },
      ...areaCards,
    ],
  }
}
