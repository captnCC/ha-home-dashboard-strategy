import type {LovelaceViewConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import {HasAreasConfig} from "../config";

export type WallboardSecurityViewStrategyConfig = {
  type: "custom:wallboard-media";
} & HasAreasConfig;


class SecurityViewStrategy extends HTMLElement {
  static async generate(_config: WallboardSecurityViewStrategyConfig, _hass: HomeAssistant): Promise<LovelaceViewConfig> {
    return {
      type: "sections",
      sections: []
    };
  }
}

customElements.define("ll-strategy-view-wallboard-security", SecurityViewStrategy);