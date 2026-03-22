// oxlint-disable import/max-dependencies
// oxlint-disable import/no-namespace
// oxlint-disable max-statements
import type {LovelaceConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/types";
import type {LovelaceViewRawConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {Config} from "../config";

import * as area from "./area-view-strategy";
import * as climate from "./climate-view-strategy";
import * as floor from "./floor-view-strategy";
import * as lights from "./lights-view-strategy";
import * as media from "./media-view-strategy";
import * as overview from "./overview-view-strategy";
import * as security from "./security-view-strategy";
import * as utilities from "./utilities-view-strategy";

export type MobileDashboardStrategyConfig = {
  type: "custom:mobile";
} & Config;

class DashboardStrategy extends HTMLElement {
  static generate(config: MobileDashboardStrategyConfig, hass: HomeAssistant): LovelaceConfig {
    const views: LovelaceViewRawConfig[] = [overview.registerView(config)];

    if (!(config.lights?.hidden === true)) {
      views.push(lights.registerView(config));
    }
    if (!(config.climate?.hidden === true)) {
      views.push(climate.registerView(config));
    }
    if (!(config.security?.hidden === true)) {
      views.push(security.registerView(config));
    }
    if (!(config.media?.hidden === true)) {
      views.push(media.registerView(config));
    }
    if (!(config.utility?.hidden === true)) {
      views.push(utilities.registerView(config));
    }

    if (config.floors !== false) {
      const floors = Object.values(hass.floors).map((floorEntry) =>
        floor.registerView(config, floorEntry),
      );
      views.push(...floors);
    }

    const areas = Object.values(hass.areas).map((areaEntry) =>
      area.registerView(config, areaEntry),
    );

    views.push(...areas);

    return {
      views,
    };
  }
}

customElements.define("ll-strategy-dashboard-mobile", DashboardStrategy);
