import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'

export type HasAreasConfig = {
  areas?: Record<string, AreaConfig>
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

export type AreaConfig = HasLightsConfig & HasBadgesConfig & {
  hidden?: boolean
  size?: 'small' | 'large'
}

export type OverviewConfig = HasLightsConfig & HasBadgesConfig & {
  weather?: string
}

export type Config = HasAreasConfig & {
  theme?: string
  overview?: OverviewConfig
}
