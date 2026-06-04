import type { EntityFilter } from "@ha/common/entity/entity_filter";
import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { FloorRegistryEntry } from "@ha/data/floor_registry";
import type { ActionConfig } from "@ha/data/lovelace/config/action";
import type { ShortcutBadgeConfig } from "@ha/panels/lovelace/badges/types";
import type { TileCardConfig } from "@ha/panels/lovelace/cards/types";
import type { Condition } from "@ha/panels/lovelace/common/validate-condition";
import type { ButtonHeadingBadgeConfig } from "@ha/panels/lovelace/heading-badges/types";
import type { HomeAssistant } from "@ha/types";
import type { HassServiceTarget } from "home-assistant-js-websocket";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { BadgeType } from "./group-badges";

import { computeGroupPopupAction } from "./group-badges";

const computeCoversPopupAction = (covers: string[], name: string): ActionConfig => {
  const cards = covers.map(
    (cover) =>
      ({
        entity: cover,
        features: [{ type: "cover-open-close" }],
        features_position: "inline",
        type: "tile",
      }) satisfies TileCardConfig,
  );
  return computeGroupPopupAction(cards, `${name} Covers`);
};

const computeGroupBadgeActionsVisibility = (entities: string[]): Condition => ({
  condition: "or" as const,
  conditions: entities.map((entityId) => ({
    condition: "state" as const,
    entity: entityId,
    state: "open",
  })),
});

// oxlint-disable-next-line max-lines-per-function max-params
const computeCoversGroupBadge = (
  hass: HomeAssistant,
  filter: EntityFilter,
  popupName: string,
  target: HassServiceTarget,
  type: BadgeType,
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  const filterFunc = generateEntityFilter(hass, filter);

  const covers = Object.keys(hass.states).filter(filterFunc);

  if (covers.length === 0) {
    return [];
  }

  const showPopupAction = computeCoversPopupAction(covers, popupName);
  const visibility = computeGroupBadgeActionsVisibility(covers);

  return [
    {
      double_tap_action: {
        action: "perform-action",
        perform_action: "cover.open_cover",
        target,
      },
      icon: "mdi:window-shutter-close",
      tap_action: showPopupAction,
      text: "Covers closed",
      type,
      visibility: [
        {
          condition: "not",
          conditions: [visibility],
        },
      ],
    },
    {
      color: "purple",
      double_tap_action: {
        action: "perform-action",
        perform_action: "cover.close_cover",
        target,
      },
      icon: "mdi:window-shutter-open",
      tap_action: showPopupAction,
      text: "Covers open",
      type,
      visibility: [visibility],
    },
  ];
};

export const computeAreaCoversBadge = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] =>
  computeCoversGroupBadge(
    hass,
    {
      area: area.area_id,
      domain: ["cover"],
    },
    area.name,
    { area_id: area.area_id },
    type,
  );

export const computeFloorCoversBadge = (
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] =>
  computeCoversGroupBadge(
    hass,
    {
      domain: ["cover"],
      floor: floor.floor_id,
    },
    floor.name,
    { floor_id: floor.floor_id },
    type,
  );

export const computeHomeCoversBadge = (
  hass: HomeAssistant,
  type: "button" | "shortcut",
): ButtonHeadingBadgeConfig[] | ShortcutBadgeConfig[] => {
  const floors = Object.keys(hass.floors);
  return computeCoversGroupBadge(
    hass,
    {
      domain: ["cover"],
      floor: floors,
    },
    "Home",
    { floor_id: floors },
    type,
  );
};
