import type { LovelaceViewConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

class WallboardSecurityViewStrategy extends  HTMLElement {
  static async generate(_config: object, _hass: HomeAssistant): Promise<LovelaceViewConfig> {
    return {
      type: "sections",
      sections: []
    };
  }
}

customElements.define("ll-strategy-view-wallboard-security", WallboardSecurityViewStrategy);