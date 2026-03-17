import { type EntityBadgeConfig } from 'home-assistant-frontend-types/frontend/panels/lovelace/badges/types'

export type HasAreasConfig = {
  areas?: Record<string, AreaConfig>
}

export type ClimateConfig = {
  hidden?: boolean
  order?: Record<string, number>
}

export type HasClimateConfig = {
  climate?: ClimateConfig
}

export type MediaConfig = {
  hidden?: boolean
  order?: Record<string, number>
}

export type HasMediaConfig = {
  media?: MediaConfig
}

export type SecurityConfig = {
  hidden?: boolean
  order?: Record<string, number>
}

export type HasSecurityConfig = {
  security?: SecurityConfig
}

export type UtilityConfig = {
  hidden?: boolean
  order?: Record<string, number>
}

export type HasUtilityConfig = {
  utility?: UtilityConfig
}

export type LightsConfig = {
  hidden?: boolean
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
  floors?: false | Record<string, FloorConfig>
}

export type AreaConfig = HasLightsConfig & HasBadgesConfig & HasClimateConfig & {
  hidden?: boolean
  size?: 'small' | 'large'
}

export type OverviewConfig = HasLightsConfig & HasBadgesConfig & {
  weather?: string
}

export type Config = {
  theme?: string
  overview?: OverviewConfig
}
& HasFloorsConfig
& HasAreasConfig
& HasLightsConfig
& HasClimateConfig
& HasMediaConfig
& HasSecurityConfig
& HasUtilityConfig
