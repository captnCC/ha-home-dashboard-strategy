
import {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";
import {computeDomain} from "../../homeassistant/common/entity/compute_domain";

const domainOptions: Record<string, Partial<EntityBadgeConfig>> = {
  sensor: {
    show_name: true,
    show_state: true,
  },
  light: {
    show_name: true,
    show_state: true,
    tap_action: { action: "toggle" },
    hold_action: { action: "more-info" },
  },
  scene: {
    show_name: false,
    show_state: false,
    tap_action: { action: "toggle" },
    hold_action: { action: "more-info" },
  },
  script: {
    show_name: true,
    show_state: false,
    tap_action: { action: "toggle" },
    hold_action: { action: "more-info" },
  },
  vacuum: {},
};

export const computeBadge = (
  entity: string
): EntityBadgeConfig => {
  const domain = computeDomain(entity);
  const options = domainOptions[domain] || {};

  return {
    type: "entity",
    show_icon: true,
    entity: entity,
    ...options,
  };
};
