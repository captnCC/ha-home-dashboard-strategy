import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import { type AreaRegistryEntry } from 'home-assistant-frontend-types/frontend/data/area/area_registry'
import { type LovelaceBadgeConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/badge'
import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'

import { type AreaConfig, type ClimateConfig, type HasLightsConfig, type LightsConfig } from '../config'
import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'

import { tapNavigate } from './navigate'
import { computeAreaTileCardConfig, extendLastCard, generateCardSort } from './cards'
import { computeBadge } from './badges'

const lightsHeading = (config: NonNullable<HasLightsConfig['lights']>) => {
  const badges: EntityBadgeConfig[] = []

  if (config.all) {
    badges.push(computeBadge(config.all))
  }

  return ({
    type: 'heading',
    heading: 'Lights',
    heading_style: 'heading',
    icon: 'mdi:lightbulb-group',
    tap_action: tapNavigate('lights'),
    badges,
  })
}

const computeLightCards = (hass: HomeAssistant, area: AreaRegistryEntry, config: LightsConfig = {}) => {
  const computeTileCard = computeAreaTileCardConfig(hass, area.name)

  const areaFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ['light'],
  })

  return Object.keys(hass.states)
    .filter(areaFilter)
    .sort(generateCardSort(config.order))
    .map(computeTileCard)
}

export const computeLightSection = (hass: HomeAssistant, area: AreaRegistryEntry, config: LightsConfig) => {
  const cards = extendLastCard(computeLightCards(hass, area, config))
  if (cards.length === 0) return []
  return [
    {
      type: 'grid',
      cards: [
        lightsHeading(config),
        ...cards,
      ],
    },
  ]
}

const climateHeading = () => ({
  type: 'heading',
  heading: 'Climate',
  heading_style: 'heading',
  icon: 'mdi:home-thermometer',
  tap_action: tapNavigate('climate'),
})

const computeClimateCards = (hass: HomeAssistant, area: AreaRegistryEntry, config: ClimateConfig) => {
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

  const states = Object.keys(hass.states)
  return extendLastCard(
    [
      ...states.filter(devicesFilter),
      ...states.filter(sensorFilter),
    ]
      .sort(generateCardSort(config.order))
      .map(computeTileCard),
  )
}

export const computeClimateSection = (hass: HomeAssistant, area: AreaRegistryEntry, config: ClimateConfig) => {
  const cards = computeClimateCards(hass, area, config)

  if (cards.length === 0) return []
  return [
    {
      type: 'grid',
      cards: [
        climateHeading(),
        ...cards,
      ],
    },
  ]
}

const mediaHeading = () => ({
  type: 'heading',
  heading: 'Media',
  heading_style: 'heading',
  icon: 'mdi:play',
  tap_action: tapNavigate('media'),
})

const computeMediaCards = (hass: HomeAssistant, area: AreaRegistryEntry) => {
  const computeTileCard = computeAreaTileCardConfig(hass, area.name)

  const areaFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ['media_player'],
  })

  return Object.keys(hass.states)
    .filter(areaFilter)
    .map(computeTileCard)
}

export const computeMediaSection = (hass: HomeAssistant, area: AreaRegistryEntry) => {
  const cards = computeMediaCards(hass, area)

  if (cards.length === 0) return []
  return [
    {
      type: 'grid',
      cards: [
        mediaHeading(),
        ...cards,
      ],
    },
  ]
}

export const computeBadges = (hass: HomeAssistant, area: AreaRegistryEntry, config: AreaConfig) => {
  const badges: LovelaceBadgeConfig[] = []

  if (area.temperature_entity_id) {
    badges.push({
      type: 'entity',
      show_name: true,
      show_state: true,
      show_icon: true,
      entity: area.temperature_entity_id,
      name: 'Temperature',
    })
  }

  if (area.humidity_entity_id) {
    badges.push({
      type: 'entity',
      show_name: true,
      show_state: true,
      show_icon: true,
      entity: area.humidity_entity_id,
      name: 'Humidity',
    })
  }

  const sceneFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ['scene'],
  })

  const scriptFilter = generateEntityFilter(hass, {
    area: area.area_id,
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

export const areaPath = (areaId: string) => `areas-${areaId}`
