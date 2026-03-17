import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'

export type HasAreasConfig = {
  areas?: Record<string, AreaConfig>
}

export type ClimateConfig = {
  order?: Record<string, number>
}

export type HasClimateConfig = {
  climate?: ClimateConfig
}

export type LightsConfig = {
  all?: string
  order?: Record<string, number>
}

export type HasLightsConfig = {
  lights?: LightsConfig
}

export type HasBadgesConfig = {
  badges?: EntityBadgeConfig[]
}

export type FloorConfig = HasLightsConfig & HasBadgesConfig

export type HasFloorsConfig = {
  floors?: Record<string, FloorConfig>
}

export type AreaConfig = HasLightsConfig & HasBadgesConfig & HasClimateConfig & {
  hidden?: boolean
  size?: 'small' | 'large'
}

export type OverviewConfig = HasLightsConfig & HasBadgesConfig & {
  weather?: string
}

export type Config = HasFloorsConfig & HasAreasConfig & {
  theme?: string
  overview?: OverviewConfig
}
