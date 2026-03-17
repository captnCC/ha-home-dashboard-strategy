import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import type { LovelaceCardConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/card'

import { computeStateName } from '../../homeassistant/common/entity/compute_state_name'
import { computeDomain } from '../../homeassistant/common/entity/compute_domain'

export const computeAreaTileCardConfig
  = (hass: HomeAssistant, prefix: string) =>
    (entity: string): LovelaceCardConfig => {
      const stateObj = hass.states[entity]
      const name = computeStateName(stateObj)
      const domain = computeDomain(entity)
      const deviceClass = computeDeviceClassSuffix(stateObj.attributes.device_class ?? '')
      const strippedName = stripSuffix(
        stripPrefix(name, prefix),
        [domain, ...deviceClass],
      )

      const features = computeTileFeatures(domain, stateObj.attributes.device_class)

      return {
        type: 'tile',
        entity: entity,
        name: strippedName,
        features_position: 'bottom',
        features,
      }
    }

export const stripPrefix = (name: string, prefix: string) =>
  name.replace(
    new RegExp(
      `^${prefix} `,
      'i',
    ),
    '',
  )

export const stripSuffix = (name: string, suffix: string | string[]) => {
  const pattern = Array.isArray(suffix) ? suffix.join('|') : suffix

  return name.replace(
    new RegExp(
      ` (${pattern})$`,
      'i',
    ),
    '',
  )
}

export const computeTileFeatures = (domain: string, deviceClass: string | null = null) => {
  switch (domain) {
    case 'light':
      return [{ type: 'light-brightness' }]
    case 'climate':
      return [
        { type: 'target-temperature' },
        { type: 'climate-preset-modes', style: 'icons' },
      ]
    case 'fan':
      return [{ type: 'toggle' }, { type: 'fan-preset-modes', style: 'icons' }]
    case 'media_player':
      return [{ type: 'media-player-playback' }]
    case 'sensor':
      switch (deviceClass) {
        case 'battery':
          return []
        default:
          return [{ type: 'trend-graph' }]
      }
    case 'vacuum':
      return [{
        type: 'vacuum-commands',
        commands: [
          'start_pause',
          'stop',
          'clean_spot',
        ],
      }]
    default:
      return []
  }
}

export const extendLastCard = (cards: LovelaceCardConfig[], odd = true) => {
  if (!!(cards.length % 2) === odd) {
    cards[cards.length - 1].grid_options = { columns: 'full' }
    cards[cards.length - 1].features_position = 'inline'
  }
  return cards
}

const computeDeviceClassSuffix = (deviceClass: string) => {
  switch (deviceClass) {
    case '':
      return []
    case 'battery':
      return ['battery', 'power']
  }

  return [deviceClass]
}

export const generateCardSort = (order: Record<string, number> = {}) => {
  return (a: string, b: string) => ((order?.[b] ?? 0) - (order?.[a] ?? 0))
}
