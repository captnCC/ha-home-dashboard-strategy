import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";

export interface HasAreasConfig {
  areas?: Record<string, AreaConfig>;
}

export interface ClimateConfig {
  hidden?: boolean;
  order?: Record<string, number>;
}

export interface HasClimateConfig {
  climate?: ClimateConfig;
}

export interface MediaConfig {
  hidden?: boolean;
  order?: Record<string, number>;
}

export interface HasMediaConfig {
  media?: MediaConfig;
}

export interface SecurityConfig {
  hidden?: boolean;
  order?: Record<string, number>;
}

export interface HasSecurityConfig {
  security?: SecurityConfig;
}

export interface UtilityConfig {
  hidden?: boolean;
  order?: Record<string, number>;
}

export interface HasUtilityConfig {
  utility?: UtilityConfig;
}

export interface LightsConfig {
  hidden?: boolean;
  all?: string;
  order?: Record<string, number>;
}

export interface HasLightsConfig {
  lights?: LightsConfig;
}

export interface HasBadgesConfig {
  badges?: EntityBadgeConfig[];
}

export type FloorConfig = HasLightsConfig & HasBadgesConfig;

export interface HasFloorsConfig {
  floors?: false | Record<string, FloorConfig>;
}

export type AreaConfig = HasLightsConfig &
  HasBadgesConfig &
  HasClimateConfig & {
    hidden?: boolean;
    size?: "small" | "large";
  };

export type OverviewConfig = HasLightsConfig &
  HasBadgesConfig & {
    weather?: string;
  };

export type Config = {
  theme?: string;
  overview?: OverviewConfig;
} & HasFloorsConfig &
  HasAreasConfig &
  HasLightsConfig &
  HasClimateConfig &
  HasMediaConfig &
  HasSecurityConfig &
  HasUtilityConfig;
