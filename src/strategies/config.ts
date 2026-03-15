

export interface LightsConfig {
  all?: string
}

export interface AreaConfig {
  hidden?: boolean
  lights?: LightsConfig
}

export interface WallboardConfig {
  lights?: LightsConfig
  areas?: Record<string, AreaConfig>
  theme?: string
}