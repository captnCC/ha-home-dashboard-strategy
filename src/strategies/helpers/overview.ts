// oxlint-disable import/max-dependencies
// oxlint-disable max-lines-per-function
import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { FloorRegistryEntry } from "@ha/data/floor_registry";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";
import type { StateCondition } from "@ha/panels/lovelace/common/validate-condition";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { AreaConfig, FloorConfig, HasAreasConfig, OverviewConfig } from "../config";
import type { FloorCallback } from "./mapping";

import { computeBadge } from "./badges";
import { computeAreaTileCardConfig, generateCardSort } from "./cards";
import { mapAreas } from "./mapping";
import { navigate, tapNavigate } from "./navigate";
import { areaPath, floorPath } from "./paths";

export const computeBadges = function computeBadges(
  hass: HomeAssistant,
  config: OverviewConfig,
): EntityBadgeConfig[] {
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
    ...states.filter(scriptFilter).map(computeBadge),
  );

  if (config.badges) {
    badges.push(...config.badges);
  }

  return badges;
};

export const computePlayingSection = function computePlayingSection(
  hass: HomeAssistant,
): LovelaceCardConfig {
  const filter = generateEntityFilter(hass, {
    domain: ["media_player"],
  });

  const cardGenerator = computeAreaTileCardConfig(hass, "");
  const players = Object.keys(hass.states).filter(filter);
  const cards = players.map(
    (entity): LovelaceCardConfig => ({
      ...cardGenerator(entity),
      features_position: "inline",
      grid_options: {
        columns: 12,
        rows: 1,
      },
      show_entity_picture: true,
      state_content: ["media_artist", "media_title", "media_album_name"],
      vertical: false,
      visibility: [
        {
          condition: "state",
          entity: entity,
          state: "playing",
        },
      ],
    }),
  );

  const conditions = players.map(
    (entity): StateCondition => ({
      condition: "state",
      entity: entity,
      state: "playing",
    }),
  );

  return {
    cards: [
      {
        heading: "Playing",
        heading_style: "title",
        icon: "mdi:play",
        type: "heading",
      },
      ...cards,
    ],
    column_span: 3,
    type: "grid",

    visibility: [
      {
        condition: "or",
        conditions,
      },
    ],
  };
};

export const computeAreaCard = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: AreaConfig,
): LovelaceCardConfig | null => {
  if (config.hidden) {
    return null;
  }

  const size = config.size ?? "large";

  const cardCompute = computeAreaTileCardConfig(hass, area.name);

  const filter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["light"],
    label: "overview",
  });

  const sort = generateCardSort(config.lights?.order);

  const overviewCards =
    size === "large"
      ? Object.keys(hass.states)
          .filter(filter)
          .toSorted(sort)
          .map((entity) => ({
            ...cardCompute(entity),
            features_position: "inline",
          }))
      : [];

  const features = [
    {
      controls: ["light", "fan"],
      type: "area-controls",
    },
  ];

  return {
    cards: [
      {
        alert_classes: ["motion", "moisture"],
        area: area.area_id,
        display_type: "compact",
        features,
        features_position: size === "large" ? "inline" : "bottom",
        navigation_path: navigate(areaPath(area.area_id)),
        sensor_classes: ["temperature", "humidity"],
        type: "area",
      },
      ...overviewCards,
    ],
    column_span: size === "large" ? 2 : 1,
    grid_options: {
      columns: size === "large" ? 12 : 6,
      rows: overviewCards.length + 1 + (size === "large" ? 0 : 1),
    },
    type: "custom:vertical-grid-in-card",
  };
};

export const computeFloorSection: FloorCallback<LovelaceCardConfig> = function computeFloorSection(
  hass: HomeAssistant,
  floor: FloorRegistryEntry,
  config: FloorConfig & HasAreasConfig,
): LovelaceCardConfig {
  const areaCards = mapAreas<LovelaceCardConfig>(
    hass,
    config.areas ?? {},
    computeAreaCard,
    ([_id, area]) => area.floor_id === floor.floor_id,
  );

  const badges: EntityBadgeConfig[] = [];

  if (config.lights?.all) {
    badges.push(computeBadge(config.lights?.all));
  }

  return {
    cards: [
      {
        badges,
        heading: floor.name,
        heading_style: "title",
        icon: floor.icon ?? "mdi:home",
        tap_action: tapNavigate(floorPath(floor.floor_id)),
        type: "heading",
      },
      ...areaCards,
    ],
    column_span: 4,
    type: "grid",
  };
};
