// oxlint-disable import/max-dependencies
import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";
import type { HomeAssistant } from "@ha/types";

import { generateEntityFilter } from "@ha/common/entity/entity_filter";

import type { AreaConfig } from "../config";

import { computeBadge } from "./badges";
import { computeAreaTileCardConfig, extendLastCard, generateCardSort } from "./cards";
import { tapNavigate } from "./navigate";
import { generateSecurityEntityFilters } from "./security";

export class AreaGenerator {
  private readonly hass: HomeAssistant;
  private readonly area: AreaRegistryEntry;
  private readonly config: AreaConfig;
  private readonly computeTileCard;

  constructor(hass: HomeAssistant, area: AreaRegistryEntry, config: AreaConfig) {
    this.hass = hass;
    this.area = area;
    this.config = config;
    this.computeTileCard = computeAreaTileCardConfig(hass, area.name);
  }

  // oxlint-disable-next-line max-params
  private createHeading(
    title: string,
    icon: string,
    navigateTo: string,
    badges: EntityBadgeConfig[] = [],
  ): LovelaceCardConfig | LovelaceBadgeConfig {
    return {
      badges,
      heading: title,
      heading_style: "heading",
      icon,
      tap_action: tapNavigate(navigateTo),
      type: "heading",
    };
  }

  private createGridSection(cards: LovelaceCardConfig[]): LovelaceCardConfig[] {
    if (cards.length === 0) {
      return [];
    }
    return [
      {
        cards,
        type: "grid",
      },
    ];
  }

  computeLightSection(): LovelaceCardConfig[] {
    const badges: EntityBadgeConfig[] = [];

    if (this.config.lights?.all) {
      badges.push(computeBadge(this.config.lights?.all));
    }

    const heading = this.createHeading("Lights", "mdi:lightbulb-group", "lights", badges);

    const areaFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      domain: ["light"],
    });

    const cards = extendLastCard(
      Object.keys(this.hass.states)
        .filter(areaFilter)
        .toSorted(generateCardSort(this.config.lights?.order))
        .map(this.computeTileCard),
    );

    return this.createGridSection([heading as LovelaceCardConfig, ...cards]);
  }

  computeClimateSection(): LovelaceCardConfig[] {
    const heading = this.createHeading("Climate", "mdi:home-thermometer", "climate");

    const devicesFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      domain: ["climate", "fan"],
    });

    const sensorFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      device_class: ["temperature", "humidity", "pm25", "co2", "aqi"],
      domain: ["sensor"],
    });

    const states = Object.keys(this.hass.states);
    const cards = extendLastCard(
      [...states.filter(devicesFilter), ...states.filter(sensorFilter)]
        .toSorted(generateCardSort(this.config.climate?.order))
        .map(this.computeTileCard),
    );

    return this.createGridSection([heading as LovelaceCardConfig, ...cards]);
  }

  computeMediaSection(): LovelaceBadgeConfig[] {
    const heading = this.createHeading("Media", "mdi:play", "media");

    const areaFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      domain: ["media_player"],
    });

    const cards = Object.keys(this.hass.states).filter(areaFilter).map(this.computeTileCard);

    return this.createGridSection([heading, ...extendLastCard(cards)]) as LovelaceBadgeConfig[];
  }

  computeSecuritySection(): LovelaceBadgeConfig[] {
    const heading = this.createHeading("Security", "mdi:lock", "security");

    const states = Object.keys(this.hass.states);
    const filters = generateSecurityEntityFilters(this.hass, this.area.area_id);

    const cards = filters.flatMap((filter) => states.filter(filter).map(this.computeTileCard));

    return this.createGridSection([heading, ...cards]) as LovelaceBadgeConfig[];
  }

  computeBadges(): LovelaceBadgeConfig[] {
    const badges: LovelaceBadgeConfig[] = [];

    if (this.area.temperature_entity_id) {
      badges.push({
        entity: this.area.temperature_entity_id,
        name: "Temperature",
        show_icon: true,
        show_name: true,
        show_state: true,
        type: "entity",
      });
    }

    if (this.area.humidity_entity_id) {
      badges.push({
        entity: this.area.humidity_entity_id,
        name: "Humidity",
        show_icon: true,
        show_name: true,
        show_state: true,
        type: "entity",
      });
    }

    const sceneFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      domain: ["scene"],
    });

    const scriptFilter = generateEntityFilter(this.hass, {
      area: this.area.area_id,
      domain: ["script"],
    });

    const states = Object.keys(this.hass.states);

    badges.push(
      ...states.filter(sceneFilter).map(computeBadge),
      ...states.filter(scriptFilter).map(computeBadge),
      ...(this.config.badges ?? []),
    );

    return badges;
  }
}
