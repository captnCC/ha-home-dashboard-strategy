import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";

import { computeDomain } from "@ha/common/entity/compute_domain";

const domainOptions: Record<string, Partial<EntityBadgeConfig>> = {
  light: {
    hold_action: { action: "more-info" },
    show_name: true,
    show_state: true,
    tap_action: { action: "toggle" },
  },
  scene: {
    hold_action: { action: "more-info" },
    show_name: false,
    show_state: false,
    tap_action: { action: "toggle" },
  },
  script: {
    hold_action: { action: "more-info" },
    show_name: true,
    show_state: false,
    tap_action: { action: "toggle" },
  },
  sensor: {
    show_name: true,
    show_state: true,
  },
  vacuum: {},
};

export const computeBadge = (entity: string): EntityBadgeConfig => {
  const domain = computeDomain(entity);
  const options = domainOptions[domain] || {};

  return {
    entity: entity,
    show_icon: true,
    type: "entity",
    ...options,
  };
};
