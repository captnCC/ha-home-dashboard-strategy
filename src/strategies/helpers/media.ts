import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'

import { computeAreaTileCardConfig, extendLastCard } from './cards'
import { tapNavigate } from './navigate'
import { areaPath } from './area'
import { mapAreas } from './mapping'

export const computeMediaAreas = (hass: HomeAssistant) => {
  return mapAreas(hass, {}, (hass, area) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name)
    const devicesFilter = generateEntityFilter(hass, {
      area: area.area_id,
      domain: ['media_player'],
    })

    const states = Object.keys(hass.states)
    const devices = states
      .filter(devicesFilter)
      .map(computeTileCard)
      .map(card => ({
        ...card,
        show_entity_picture: true,
        vertical: false,
        features_position: 'bottom',
        state_content: ['media_artist', 'media_title', 'media_album_name'],
      }))

    if (devices.length === 0) return null

    return {
      type: 'grid',
      cards: [
        {
          type: 'heading',
          heading: area.name,
          heading_style: 'title',
          icon: area.icon,
          tap_action: tapNavigate(areaPath(area.area_id)),
        },
        ...extendLastCard(devices),
      ],
    }
  })
}
