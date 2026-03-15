import type { HomeAssistant } from "home-assistant-frontend-types/frontend/types";
import type { LovelaceCardConfig } from "home-assistant-frontend-types/frontend/data/lovelace/config/card";
import type { AreaRegistryEntry } from "home-assistant-frontend-types/frontend/data/area/area_registry";
import {computeStateName} from "../../homeassistant/common/entity/compute_state_name";
import {computeDomain} from "../../homeassistant/common/entity/compute_domain";
import {AreaConfig} from "../config";

type AreaCallback<T> = (area: AreaRegistryEntry, areaId: string, config: AreaConfig) => T | null;

export const mapAreas = <T>(
  hass: HomeAssistant,
  configs: Record<string, AreaConfig>,
  callback: AreaCallback<T>
): NonNullable<T>[] =>
  Object.entries(hass.areas)
    .map(([areaId, area]) => callback(area, areaId, configs[areaId] || {}))
    .filter((val) => val !== null) as NonNullable<T>[];

export const computeAreaTileCardConfig =
  (hass: HomeAssistant, prefix: string) =>
  (entity: string): LovelaceCardConfig => {
    const stateObj = hass.states[entity];
    const name = computeStateName(stateObj);
    const domain = computeDomain(entity);
    const strippedName = stripDomainSuffix(
      stripAreaPrefix(name, prefix),
      domain
    );

    const features = computeTileFeatures(domain);

    return {
      type: "tile",
      entity: entity,
      name: strippedName,
      features_position: "bottom",
      features,
    };
  };

const stripAreaPrefix = (name: string, area: string) =>
  name.replace(new RegExp(`^${area} `, "i"), "");
const stripDomainSuffix = (name: string, domain: string) =>
  name.replace(new RegExp(` ${domain}$`, "i"), "");

const computeTileFeatures = (domain: string) => {
  switch (domain) {
    case "light":
      return [{ type: "light-brightness" }];
    case "climate":
      return [
        { type: "target-temperature" },
        { type: "climate-preset-modes", style: "icons" },
      ];
    case "fan":
      return [{ type: "toggle" }, { type: "fan-preset-modes", style: "icons" }];
    case "media_player":
      return [{ type: "media-player-playback" }];
    case "sensor":
      return [{ type: "trend-graph" }];
    default:
      return [];
  }
};

export const extendLastCard = (cards: LovelaceCardConfig[], odd = true) => {
  if (!!(cards.length % 2) === odd) {
    cards[cards.length - 1].grid_options = { columns: "full" };
  }
  return cards;
};
