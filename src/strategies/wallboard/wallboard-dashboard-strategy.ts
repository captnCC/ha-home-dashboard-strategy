import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";
import type { LovelaceConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/types";
import type { LovelaceViewRawConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type { Config } from "../config";
import {WallboardOverviewViewStrategyConfig} from "./wallboard-overview-view-strategy";

export type WallboardDashboardStrategyConfig = {
  type: "custom:wallboard";
} & Config

class WallboardDashboardStrategy extends  HTMLElement {
  static async generate(
    config: WallboardDashboardStrategyConfig,
    hass: HomeAssistant
  ): Promise<LovelaceConfig> {

    const areas: LovelaceViewRawConfig[] = Object.entries(hass.areas).map(
      ([areaId, area]) => ({
        path: `areas-${areaId}`,
        title: area.name,
        subview: true,
        theme: config.theme,
        strategy: {
          type: "custom:wallboard-room",
          area: areaId,
          ...config.areas?.[areaId],
        },
      })
    );

    const views: LovelaceViewRawConfig[] = [
      {
        icon: "mdi:home",
        path: "overview",
        strategy: {
          type: "custom:wallboard-overview",
          areas: config.areas,
          ...config.overview,
        },
        theme: config.theme,
      },
      {
        icon: "mdi:home-lightbulb-outline",
        path: "lights",
        title: "Lights",
        strategy: {
          type: "custom:wallboard-lights",
          areas: config.areas,
          ...config.overview?.lights
        },
        theme: config.theme,
      },
      {
        icon: "mdi:home-thermometer-outline",
        path: "climate",
        title: "Climate",
        strategy: {
          type: "custom:wallboard-climate",
        },
        theme: config.theme,
      },
      {
        icon: "mdi:home-lock-open",
        path: "security",
        title: "Security",
        strategy: {
          type: "custom:wallboard-security",
        },
        theme: config.theme,
      },
      ...areas,
    ]

    return {
      views
    };
  }
}

customElements.define("ll-strategy-dashboard-wallboard", WallboardDashboardStrategy);
