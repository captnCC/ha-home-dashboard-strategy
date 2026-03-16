import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'

export type HasAreasConfig = {
  areas?: Record<string, AreaConfig>
}

export type HasLightsConfig = {
  lights?: {
    all?: string
  }
}

export type HasBadgesConfig = {
  badges?: EntityBadgeConfig[]
}

export type AreaConfig = HasLightsConfig & HasBadgesConfig & {
  hidden?: boolean
}

export type OverviewConfig = HasLightsConfig & HasBadgesConfig & {
  weather?: string
}

export type Config = HasAreasConfig & {
  theme?: string
  overview?: OverviewConfig
}
