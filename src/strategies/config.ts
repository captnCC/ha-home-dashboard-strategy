import {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";

export interface LightsConfig {
    all?: string
}

export interface AreaConfig {
    hidden?: boolean
    lights?: LightsConfig
    badges?: EntityBadgeConfig[]
}

export interface Config {
    theme?: string
    overview?: {
        lights?: LightsConfig
        badges?: EntityBadgeConfig[]
    }
    areas?: Record<string, AreaConfig>
}