import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { AreaConfig, Config } from "../config";

import { AreaGenerator } from "../helpers/area";
import { WALLBOARD_HEADER } from "../helpers/header";
import { areaPath } from "../helpers/paths";

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
      ...WALLBOARD_HEADER,
    };

    const generator = new AreaGenerator(hass, area, config);

    const badges = generator.computeBadges();

    const sections = [
      ...generator.computeLightSection(),
      ...generator.computeClimateSection(),
      ...generator.computeMediaSection(),
      ...generator.computeSecuritySection(),
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
