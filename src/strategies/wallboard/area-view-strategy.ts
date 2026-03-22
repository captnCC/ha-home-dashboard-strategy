import type {AreaRegistryEntry} from "home-assistant-frontend-types/frontend/data/area/area_registry";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {AreaConfig, Config} from "../config";

import {computeBadges, computeClimateSection, computeLightSection, computeMediaSection} from "../helpers/area";
import {wallboardHeader} from "../helpers/header";
import {areaPath} from "../helpers/paths";

export type WallboardAreaViewStrategyConfig = {
  type: "custom:wallboard-area";
  area: string;
} & AreaConfig;

export const registerView = function registerView(
  config: Config,
  area: AreaRegistryEntry,
): LovelaceStrategyViewConfig {
  const strategy: WallboardAreaViewStrategyConfig = {
    area: area.area_id,
    type: "custom:wallboard-area",
    ...config.areas?.[area.area_id],
  };

  return {
    path: areaPath(area.area_id),
    strategy,
    subview: true,
    theme: config.theme,
    title: area.name,
  };
};

class AreaViewStrategy extends HTMLElement {
  static generate(
    config: WallboardAreaViewStrategyConfig,
    hass: HomeAssistant,
  ): LovelaceViewConfig {
    const area = hass.areas[config.area];

    const header: LovelaceViewHeaderConfig = {
      card: {
        content: `# <ha-icon icon="${area.icon}"></ha-icon> ${area.name}`,
        text_only: true,
        type: "markdown",
      },
      ...wallboardHeader,
    };

    const badges = computeBadges(hass, area, config);

    if (config.badges) {
      badges.push(...config.badges);
    }

    const sections = [
      ...computeLightSection(hass, area, config.lights || {}),
      ...computeClimateSection(hass, area, config.climate || {}),
      ...computeMediaSection(hass, area),
    ];

    return {
      badges,
      header,
      max_columns: 3,
      sections,
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-wallboard-area", AreaViewStrategy);
