import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { HomeAssistant } from "@ha/types";

import { computeDomain } from "@ha/common/entity/compute_domain";
import { computeStateName } from "@ha/common/entity/compute_state_name";

export const stripPrefix = (name: string, prefix: string): string =>
  name.replace(new RegExp(`^${prefix} `, "i"), "");

export const stripSuffix = (name: string, suffix: string | string[]): string => {
  const pattern = Array.isArray(suffix) ? suffix.join("|") : suffix;

  return name.replace(new RegExp(` (${pattern})$`, "i"), "");
};

// oxlint-disable-next-line max-statements
export const computeTileFeatures = (domain: string, attributes: Record<string, unknown>) => {
  switch (domain) {
    case "light": {
      // oxlint-disable-next-line no-undefined
      if (attributes["brightness"] !== undefined) {
        return [{ type: "light-brightness" }];
      }
      return [{ type: "toggle" }];
    }
    case "climate": {
      return [{ type: "target-temperature" }, { style: "icons", type: "climate-preset-modes" }];
    }
    case "fan": {
      return [{ type: "toggle" }, { style: "icons", type: "fan-preset-modes" }];
    }
    case "media_player": {
      return [{ type: "media-player-playback" }];
    }
    case "sensor": {
      switch (attributes.device_class ?? "") {
        case "battery": {
          return [];
        }
        default: {
          return [{ type: "trend-graph" }];
        }
      }
    }
    case "vacuum": {
      return [
        {
          commands: ["start_pause", "stop", "clean_spot"],
          type: "vacuum-commands",
        },
      ];
    }
    default: {
      return [];
    }
  }
};

export const extendLastCard = (cards: LovelaceCardConfig[], odd = true): LovelaceCardConfig[] => {
  if (Boolean(cards.length % 2 > 0) === odd) {
    const card = cards.at(-1);

    if (card) {
      card.grid_options = { columns: "full" };
      card.features_position = "inline";
    }
  }
  return cards;
};

const computeDeviceClassSuffix = (deviceClass: string): string[] => {
  switch (deviceClass) {
    case "": {
      return [];
    }
    case "battery": {
      return ["battery", "power"];
    }
    default: {
      return [deviceClass];
    }
  }
};

export const generateCardSort =
  (order: Record<string, number> = {}) =>
  // oxlint-disable-next-line id-length
  (a: string, b: string): number =>
    (order?.[b] ?? 0) - (order?.[a] ?? 0);

export const computeAreaTileCardConfig =
  (hass: HomeAssistant, prefix: string) =>
  (entity: string): LovelaceCardConfig => {
    const stateObj = hass.states[entity];
    const name = computeStateName(stateObj);
    const domain = computeDomain(entity);
    const deviceClass = computeDeviceClassSuffix(stateObj.attributes.device_class ?? "");
    const strippedName = stripSuffix(stripPrefix(name, prefix), [domain, ...deviceClass]);

    const features = computeTileFeatures(domain, stateObj.attributes);

    return {
      entity: entity,
      features,
      features_position: "bottom",
      name: strippedName,
      type: "tile",
    };
  };
