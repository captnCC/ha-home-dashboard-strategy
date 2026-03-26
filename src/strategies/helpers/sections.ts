import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";
import type { EntityBadgeConfig } from "@ha/panels/lovelace/badges/types";

import { tapNavigate } from "./navigate";
import { areaPath } from "./paths";

export const generateAreaHeading = (
  area: AreaRegistryEntry,
  badges: EntityBadgeConfig[] = [],
): LovelaceCardConfig => ({
  badges,
  heading: area.name,
  heading_style: "title",
  icon: area.icon,
  tap_action: tapNavigate(areaPath(area.area_id)),
  type: "heading",
});
