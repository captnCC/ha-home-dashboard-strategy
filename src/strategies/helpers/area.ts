import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { AreaConfig, ClimateConfig, HasLightsConfig, LightsConfig } from "../config";

import { computeBadge } from "./badges";
import { computeAreaTileCardConfig, extendLastCard, generateCardSort } from "./cards";
import { tapNavigate } from "./navigate";

const lightsHeading = (config: NonNullable<HasLightsConfig["lights"]>): LovelaceCardConfig => {
  const badges: EntityBadgeConfig[] = [];

  if (config.all) {
    badges.push(computeBadge(config.all));
  }

  return {
    badges,
    heading: "Lights",
    heading_style: "heading",
    icon: "mdi:lightbulb-group",
    tap_action: tapNavigate("lights"),
    type: "heading",
  };
};

const computeLightCards = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: LightsConfig = {},
): LovelaceCardConfig[] => {
  const computeTileCard = computeAreaTileCardConfig(hass, area.name);

  const areaFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["light"],
  });

  return Object.keys(hass.states)
    .filter(areaFilter)
    .toSorted(generateCardSort(config.order))
    .map(computeTileCard);
};

export const computeLightSection = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: LightsConfig,
): LovelaceCardConfig[] => {
  const cards = extendLastCard(computeLightCards(hass, area, config));
  if (cards.length === 0) {
    return [];
  }
  return [
    {
      cards: [lightsHeading(config), ...cards],
      type: "grid",
    },
  ];
};

const climateHeading = (): LovelaceBadgeConfig => ({
  heading: "Climate",
  heading_style: "heading",
  icon: "mdi:home-thermometer",
  tap_action: tapNavigate("climate"),
  type: "heading",
});

const computeClimateCards = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: ClimateConfig,
): LovelaceCardConfig[] => {
  const computeTileCard = computeAreaTileCardConfig(hass, area.name);

  const devicesFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["climate", "fan"],
  });

  const sensorFilter = generateEntityFilter(hass, {
    area: area.area_id,
    device_class: ["temperature", "humidity", "pm25", "co2", "aqi"],
    domain: ["sensor"],
  });

  const states = Object.keys(hass.states);
  return extendLastCard(
    [...states.filter(devicesFilter), ...states.filter(sensorFilter)]
      .toSorted(generateCardSort(config.order))
      .map(computeTileCard),
  );
};

export const computeClimateSection = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: ClimateConfig,
): LovelaceCardConfig[] => {
  const cards = computeClimateCards(hass, area, config);

  if (cards.length === 0) {
    return [];
  }
  return [
    {
      cards: [climateHeading(), ...cards],
      type: "grid",
    },
  ];
};

const mediaHeading = (): LovelaceBadgeConfig => ({
  heading: "Media",
  heading_style: "heading",
  icon: "mdi:play",
  tap_action: tapNavigate("media"),
  type: "heading",
});

const computeMediaCards = (hass: HomeAssistant, area: AreaRegistryEntry): LovelaceBadgeConfig[] => {
  const computeTileCard = computeAreaTileCardConfig(hass, area.name);

  const areaFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["media_player"],
  });

  return Object.keys(hass.states).filter(areaFilter).map(computeTileCard);
};

export const computeMediaSection = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
): LovelaceBadgeConfig[] => {
  const cards = computeMediaCards(hass, area);

  if (cards.length === 0) {
    return [];
  }
  return [
    {
      cards: [mediaHeading(), ...cards],
      type: "grid",
    },
  ];
};

export const computeBadges = (
  hass: HomeAssistant,
  area: AreaRegistryEntry,
  config: AreaConfig,
): LovelaceBadgeConfig[] => {
  const badges: LovelaceBadgeConfig[] = [];

  if (area.temperature_entity_id) {
    badges.push({
      entity: area.temperature_entity_id,
      name: "Temperature",
      show_icon: true,
      show_name: true,
      show_state: true,
      type: "entity",
    });
  }

  if (area.humidity_entity_id) {
    badges.push({
      entity: area.humidity_entity_id,
      name: "Humidity",
      show_icon: true,
      show_name: true,
      show_state: true,
      type: "entity",
    });
  }

  const sceneFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["scene"],
  });

  const scriptFilter = generateEntityFilter(hass, {
    area: area.area_id,
    domain: ["script"],
  });

  const states = Object.keys(hass.states);

  badges.push(
    ...states.filter(sceneFilter).map(computeBadge),
    ...states.filter(scriptFilter).map(computeBadge),
    ...(config.badges ?? []),
  );

  return badges;
};
