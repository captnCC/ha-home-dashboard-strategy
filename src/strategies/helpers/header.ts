import type { LovelaceViewHeaderConfig } from "@ha/data/lovelace/config/view";

export const MOBILE_HEADER: Partial<LovelaceViewHeaderConfig> = {
  badges_position: "bottom",
  badges_wrap: "scroll",
  layout: "start",
};

export const WALLBOARD_HEADER: Partial<LovelaceViewHeaderConfig> = {
  badges_position: "bottom",
  badges_wrap: "wrap",
  layout: "responsive",
};
