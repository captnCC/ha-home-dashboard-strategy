import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { FloorRegistryEntry } from "@ha/data/floor_registry";
import type { ActionConfig } from "@ha/data/lovelace/config/action";
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { ShortcutBadgeConfig } from "@ha/panels/lovelace/badges/types";
import type { TileCardConfig } from "@ha/panels/lovelace/cards/types";
import type { Condition } from "@ha/panels/lovelace/common/validate-condition";
import type { ButtonHeadingBadgeConfig } from "@ha/panels/lovelace/heading-badges/types";
import type { HomeAssistant } from "@ha/types";
import type { HassServiceTarget } from "home-assistant-js-websocket";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { AreaConfig, HasAreasConfig, HasLightsConfig } from "../config";
import type { BadgeType } from "./group-badges";

import { computeEntityBadge } from "./badges";
import { computeAreaTileCardConfig, extendLastCard, generateCardSort } from "./cards";
import { computeGroupPopupAction } from "./group-badges";
import { mapAreas } from "./mapping";
import { generateAreaHeading } from "./sections";

/**
 * Create the modal popup action
 * @param lights
 * @param name
 */
const lightsPopupAction = (lights: string[], name: string): ActionConfig => {
  const cards = lights.map(
    (light) =>
      ({
        entity: light,
        features: [{ type: "light-brightness" }, { type: "toggle" }],
        features_position: "inline",
        type: "tile",
      }) satisfies TileCardConfig,
  );
  return computeGroupPopupAction(cards, `${name} Lights`);
};

const computeGroupBadgeActionsVisibility = (entities: string[]): Condition => ({
  condition: "or" as const,
  conditions: entities.map((entityId) => ({
    condition: "state" as const,
    entity: entityId,
    state: "on",
  })),
});

// oxlint-disable-next-line max-params
const computeLightsGroupBadge = (
  lights: string[],
  popupName: string,
  target: HassServiceTarget,
  type: BadgeType,
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  if (lights.length === 0) {
    return [];
  }

  const showPopupAction = lightsPopupAction(lights, popupName);
  const visibility = computeGroupBadgeActionsVisibility(lights);

  return [
    {
      double_tap_action: {
        action: "perform-action",
        perform_action: "light.turn_on",
        target,
      },
      icon: "mdi:lightbulb-group-outline",
      tap_action: showPopupAction,
      text: "Lights Off",
      type,
      visibility: [
        {
          condition: "not",
          conditions: [visibility],
        },
      ],
    },
    {
      color: "amber",
      double_tap_action: {
        action: "perform-action",
        perform_action: "light.turn_off",
        target,
      },
      icon: "mdi:lightbulb-group",
      tap_action: showPopupAction,
      text: "Lights on",
      type,
      visibility: [visibility],
    },
  ];
};

export const computeHomeLightsBadge = (
  hass: HomeAssistant,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  const filter = generateEntityFilter(hass, {
    domain: ["light"],
  });

  const lights = Object.keys(hass.states).filter(filter);

  return computeLightsGroupBadge(lights, "Home", { floor_id: Object.keys(hass.floors) }, type);
};

export const computeAreaLightsBadge = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  const filter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["light"],
  });

  const lights = Object.keys(hass.states).filter(filter);

  return computeLightsGroupBadge(lights, area.name, { area_id: area.area_id }, type);
};

export const computeFloorLightsBadge = (
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  const filter = generateEntityFilter(hass, {
    domain: ["light"],
    floor: floor.floor_id,
  });

  const lights = Object.keys(hass.states).filter(filter);

  return computeLightsGroupBadge(lights, floor.name, { floor_id: floor.floor_id }, type);
};

export const computeLightBadges = (
  hass: HomeAssistant,
  config: HasLightsConfig["lights"] & HasAreasConfig = {},
): LovelaceBadgeConfig[] => {
  const badges: LovelaceBadgeConfig[] = [];
  if (config.all) {
    badges.push(computeEntityBadge(config.all));
  } else {
    badges.push(...computeHomeLightsBadge(hass, "shortcut"));
  }

  const areaConfigs = config.areas ?? {};
  for (const area of Object.values(hass.areas)) {
    const areaCfg = areaConfigs[area.area_id] || {};
    if (areaCfg?.lights?.all) {
      badges.push({
        ...computeEntityBadge(areaCfg.lights?.all),
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

    const badges: LovelaceBadgeConfig[] = [];
    const areaConf = areas[area.area_id] ?? {};
    const allLights = areaConf.lights?.all;
    if (allLights) {
      badges.push(computeEntityBadge(allLights));
    } else {
      badges.push(...computeAreaLightsBadge(hass, area, "button"));
    }

    return {
      cards: [generateAreaHeading(area, badges), ...cards],
      type: "grid",
    };
  });
};
