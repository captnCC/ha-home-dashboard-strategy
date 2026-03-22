import type { FloorRegistryEntry } from "@ha/data/floor_registry";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig,
  LovelaceViewHeaderConfig,
} from "@ha/data/lovelace/config/view";
import type { HomeAssistant } from "@ha/types";

import type { Config, FloorConfig, HasAreasConfig } from "../config";

import { computeAreasSection, computeBadges, getFloorConfig } from "../helpers/floor";
import { mobileHeader } from "../helpers/header";
import { floorPath } from "../helpers/paths";

export type MobileFloorViewStrategyConfig = {
  type: "custom:mobile-floor";
  floor: string;
} & FloorConfig &
  HasAreasConfig;

export const registerView = function registerView(
  config: Config,
  floor: FloorRegistryEntry,
): LovelaceStrategyViewConfig {
  const floorCfg = getFloorConfig(config, floor.floor_id);

  const strategy: MobileFloorViewStrategyConfig = {
    areas: config.areas,
    floor: floor.floor_id,
    type: "custom:mobile-floor",
    ...floorCfg,
  };

  return {
    path: floorPath(floor.floor_id),
    strategy,
    subview: true,
    theme: config.theme,
    title: floor.name,
  };
};

class FloorViewStrategy extends HTMLElement {
  static generate(config: MobileFloorViewStrategyConfig, hass: HomeAssistant): LovelaceViewConfig {
    const floor = hass.floors[config.floor];

    const header: LovelaceViewHeaderConfig = {
      card: {
        content: `# <ha-icon icon="${floor.icon}"></ha-icon> ${floor.name}`,
        text_only: true,
        type: "markdown",
      },
      ...mobileHeader,
    };

    return {
      badges: computeBadges(hass, floor, config),
      header,
      max_columns: 1,
      sections: [computeAreasSection(hass, floor, config)],
      type: "sections",
    };
  }
}

customElements.define("ll-strategy-view-mobile-floor", FloorViewStrategy);
