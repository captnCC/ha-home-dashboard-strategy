import type { AreaRegistryEntry } from "@ha/data/area/area_registry";
import type { LovelaceBadgeConfig } from "@ha/data/lovelace/config/badge";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";

import { tapNavigate } from "./navigate";
import { areaPath } from "./paths";

export const generateAreaHeading = (
  area: AreaRegistryEntry,
  badges: LovelaceBadgeConfig[] = [],
): LovelaceCardConfig => ({
  badges,
  heading: area.name,
  heading_style: "title",
  icon: area.icon,
  tap_action: tapNavigate(areaPath(area.area_id)),
  type: "heading",
});
