import type { LovelaceViewHeaderConfig } from "@ha/data/lovelace/config/view";

export const mobileHeader: Partial<LovelaceViewHeaderConfig> = {
  badges_position: "bottom",
  badges_wrap: "scroll",
  layout: "start",
};

export const wallboardHeader: Partial<LovelaceViewHeaderConfig> = {
  badges_position: "bottom",
  badges_wrap: "wrap",
  layout: "responsive",
};
