import type { ActionConfig } from "@ha/data/lovelace/config/action";
import type { LovelaceCardConfig } from "@ha/data/lovelace/config/card";

export const computeGroupPopupAction = (cards: LovelaceCardConfig[], title: string): ActionConfig =>
  ({
    action: "fire-dom-event",
    browser_mod: {
      data: {
        content: {
          cards,
          type: "custom:vertical-grid-in-card",
        },
        title,
      },
      service: "browser_mod.popup",
    },
    service: "fire-dom-event",
  }) as ActionConfig;

export type BadgeType = "button" | "shortcut";
