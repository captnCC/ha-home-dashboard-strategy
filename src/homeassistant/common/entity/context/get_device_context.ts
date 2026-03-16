import { DeviceRegistryEntry } from 'home-assistant-frontend-types/frontend/data/device_registry'
import { AreaRegistryEntry } from 'home-assistant-frontend-types/frontend/data/area/area_registry'
import { FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'
import { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'

interface DeviceContext {
  device: DeviceRegistryEntry
  area: AreaRegistryEntry | null
  floor: FloorRegistryEntry | null
}

export const getDeviceContext = (
  device: DeviceRegistryEntry,
  hass: HomeAssistant,
): DeviceContext => {
  const areaId = device.area_id
  const area = areaId ? hass.areas[areaId] : undefined
  const floorId = area?.floor_id
  const floor = floorId ? hass.floors[floorId] : undefined

  return {
    device: device,
    area: area || null,
    floor: floor || null,
  }
}
