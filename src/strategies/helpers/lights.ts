// oxlint-disable max-statements
import type {LovelaceCardConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import type {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";

import type {AreaConfig, HasAreasConfig, HasLightsConfig} from "../config";

import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";
import {computeBadge} from "./badges";
import {computeAreaTileCardConfig, extendLastCard, generateCardSort} from "./cards";
import {mapAreas} from "./mapping";
import {tapNavigate} from "./navigate";
import {areaPath} from "./paths";

export const computeLightBadges = (
  hass: HomeAssistant,
  config: HasLightsConfig["lights"] & HasAreasConfig = {},
): EntityBadgeConfig[] => {
  const badges: EntityBadgeConfig[] = [];
  if (config.all) {
    badges.push(computeBadge(config.all));
  }

  const areaConfigs = config.areas ?? {};
  for (const area of Object.values(hass.areas)) {
    const areaCfg = areaConfigs[area.area_id] || {};
    if (areaCfg?.lights?.all) {
      badges.push({
        ...computeBadge(areaCfg.lights?.all),
        // oxlint-disable-next-line no-undefined
        icon: area.icon ?? undefined,
        name: area.name,
      });
    }
  }

  return badges;
};

export const computeLightAreas = (
  hass: HomeAssistant,
  areas: Record<string, AreaConfig> = {},
): LovelaceCardConfig[] => {
  const states = Object.keys(hass.states);
  return mapAreas<LovelaceCardConfig>(hass, areas, (_hass, area, config) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const areaFilter = generateEntityFilter(hass, {
      area: area.area_id,
      domain: ["light"],
    });

    const cards = extendLastCard(
      states
        .filter(areaFilter)
        .toSorted(generateCardSort(config.lights?.order))
        .map(computeTileCard),
    );

    if (cards.length === 0) {
      return null;
    }

    const badges: EntityBadgeConfig[] = [];
    const areaConf = areas[area.area_id] ?? {};
    const allLights = areaConf.lights?.all;
    if (allLights) {
      badges.push(computeBadge(allLights));
    }

    return {
      cards: [
        {
          badges,
          heading: area.name,
          heading_style: "title",
          icon: area.icon,
          tap_action: tapNavigate(areaPath(area.area_id)),
          type: "heading",
        },
        ...cards,
      ],
      type: "grid",
    };
  });
};
