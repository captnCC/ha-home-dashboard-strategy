import { type HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

import { generateEntityFilter } from '../../homeassistant/common/entity/entity_filter'

import { computeAreaTileCardConfig, mapAreas } from './cards'
import { tapNavigate } from './navigate'
import { areaPath } from './area'

export const computeUtilityAreas = (hass: HomeAssistant) => {
  const states = Object.keys(hass.states)
  return mapAreas(hass, {}, (area) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name)

    const vacuums = states
      .filter(generateEntityFilter(hass, { area: area.area_id, domain: 'vacuum' }))
      .map(computeTileCard)

    const batteries = states
      .filter(generateEntityFilter(hass, { area: area.area_id, domain: 'sensor', device_class: 'battery' }))
      .map(computeTileCard)

    if (vacuums.length + batteries.length === 0) {
      return null
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
        },
        ...vacuums,
        ...batteries,
      ],
    }
  })
}
