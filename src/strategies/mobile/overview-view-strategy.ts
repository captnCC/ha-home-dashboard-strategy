import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";
import type {
  LovelaceStrategyViewConfig,
  LovelaceViewConfig
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import { computeAreaTileCardConfig, mapAreas } from "../helpers/cards";
import type { LovelaceCardConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import { computeBadge } from "../helpers/badges";
import {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";
import {StateCondition} from "home-assistant-frontend-types/frontend/panels/lovelace/common/validate-condition";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";
import {AreaConfig, Config} from "../config";

export interface MobileOverviewViewStrategyConfig {
  type: "custom:mobile-overview";
  areas?: Record<string, AreaConfig>;
  badges?: EntityBadgeConfig[];
  lights?: {
    all?: string;
  };
}

export const registerView = function (config: Config): LovelaceStrategyViewConfig {
  const strategy: MobileOverviewViewStrategyConfig = {
    type: "custom:mobile-overview",
    areas: config.areas,
    ...config.overview,
  };

  return {
    strategy,
    icon: "mdi:home",
    path: "overview",
    theme: config.theme,
  };
};

class MobileOverviewViewStrategy extends  HTMLElement {
  static async generate(
    config: MobileOverviewViewStrategyConfig,
    hass: HomeAssistant
  ): Promise<LovelaceViewConfig> {
    const states = Object.keys(hass.states);

    const badges: EntityBadgeConfig[] = [];

    if (config.lights?.all) {
      badges.push(computeBadge(config.lights.all));
    }

    const scenesFilter = generateEntityFilter(hass, {
      domain: ["scene"],
      label: "overview",
    });

    const scriptFilter = generateEntityFilter(hass, {
      domain: ["script"],
      label: "overview",
    });

    badges.push(
      ...states.filter(scenesFilter).map(computeBadge),
      ...states.filter(scriptFilter).map(computeBadge)
    );

    if(config.badges){
      badges.push(...config.badges);
    }


    return {
      type: "sections",
      max_columns: 4,
      header: {
        layout: "responsive",
        badges_position: "bottom",
        badges_wrap: "scroll",
      },
      badges,
      sections: [computePlayingSection(hass), computeAreasSection(hass, config.areas || {})],
    };
  }
}

const computeAreasSection = function (hass: HomeAssistant, configs: Record<string, AreaConfig>) {

  const areaCards = mapAreas<LovelaceCardConfig>(hass, configs, (area, areaId, config) => {
    if (config.hidden) return null;

    const cardCompute = computeAreaTileCardConfig(hass, area.name);
    const filter = generateEntityFilter(hass, {
      area: areaId,
      label: "overview",
      domain: ["light"]
    });

    const overviewCards = Object.keys(hass.states)
      .filter(filter)
      .map(
        (entity) => ({
          ...cardCompute(entity),
          features_position: "inline",
        })
      );

    const features =
      overviewCards.length !== 10
        ? [
          {
            type: "area-controls",
            controls: ["light", "fan"],
          },
        ]
        : [];

    return {
      type: "custom:vertical-stack-in-card",
      column_span: 2,
      cards: [
        {
          type: "area",
          area: areaId,
          features,
          features_position: "inline",
          display_type: "compact",
          alert_classes: ["motion", "moisture"],
          sensor_classes: ["temperature", "humidity"],
          navigation_path: `areas-${areaId}?historyBack=1`,
          card_mod: {
            style: `
              ha-card {
                background: none;
                box-shadow: none;
                border: none;
              }
            }`
          },
        },
        ...overviewCards,
      ],
    };
  });



  return {
    type: "grid",
    column_span: 4,
    cards: [
      {
        type: "heading",
        heading: "Areas",
        heading_style: "title",
        icon: "mdi:floor-plan",
      },
      ...areaCards,
    ],
  };
};

const computePlayingSection = function (
  hass: HomeAssistant
): LovelaceCardConfig {
  const filter = generateEntityFilter(hass, {
    domain: ["media_player"],
  });

  const cardGenerator = computeAreaTileCardConfig(hass, "");
  const players = Object.keys(hass.states).filter(filter);
  const cards = players.map(
    (entity): LovelaceCardConfig => ({
      ...cardGenerator(entity),
      grid_options: {
        columns: 12,
        rows: 1,
      },
      show_entity_picture: true,
      vertical: false,
      features_position: "inline",
      state_content: ["media_artist", "media_title", "media_album_name"],
      visibility: [
        {
          condition: "state",
          entity: entity,
          state: "playing",
        },
      ],
    })
  );

  const conditions = players.map(
    (entity): StateCondition => ({
      condition: "state",
      entity: entity,
      state: "playing",
    })
  );

  return {
    type: "grid",
    column_span: 3,
    visibility: [
      {
        condition: "or",
        conditions,
      },
    ],

    cards: [
      {
        type: "heading",
        heading: "Playing",
        heading_style: "title",
        icon: "mdi:play",
      },
      ...cards,
    ],
  };
};

customElements.define("ll-strategy-view-mobile-overview", MobileOverviewViewStrategy);
