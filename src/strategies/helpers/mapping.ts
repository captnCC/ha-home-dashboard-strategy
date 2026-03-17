import type { HomeAssistant } from 'home-assistant-frontend-types/frontend/types'
import { type AreaRegistryEntry } from 'home-assistant-frontend-types/frontend/data/area/area_registry'
import { type FloorRegistryEntry } from 'home-assistant-frontend-types/frontend/data/floor_registry'

import { type AreaConfig, type FloorConfig, type HasAreasConfig, type HasFloorsConfig } from '../config'

export type AreaCallback<T> = (hass: HomeAssistant, area: AreaRegistryEntry, areaId: string, config: AreaConfig) => T | null

export const mapAreas = <T>(
  hass: HomeAssistant,
  configs: Record<string, AreaConfig>,
  callback: AreaCallback<T>,
  filter?: (area: [string, AreaRegistryEntry]) => boolean,
): NonNullable<T>[] =>
  Object.entries(hass.areas)
    .filter(filter ?? (() => true))
    .map(([areaId, area]) => {
      return callback(hass, area, areaId, configs?.[areaId] || {})
    })
    .filter(val => val !== null) as NonNullable<T>[]

export type FloorCallback<T> = (hass: HomeAssistant, floor: FloorRegistryEntry, config: FloorConfig & HasAreasConfig) => T | null

export const mapFloors = <T>(
  hass: HomeAssistant,
  config: HasFloorsConfig & HasAreasConfig,
  callback: FloorCallback<T>,
): NonNullable<T>[] =>
  Object.entries(hass.floors)
    .map(([, floor]) => callback(
      hass,
      floor,
      {
        ...config.floors?.[floor.floor_id] ?? {},
        areas: (config.areas ?? {}),
      }
    ))
    .filter(val => val !== null) as NonNullable<T>[]
