// oxlint-disable no-console
// oxlint-disable import/no-unassigned-import
import "./strategies/wallboard/dashboard-strategy";
import "./strategies/mobile/dashboard-strategy";
import "./cards/vertical-stack-in-card";

declare global {
  interface Window {
    // oxlint-disable-next-line typescript/consistent-type-imports
    loadCardHelpers(): Promise<typeof import("@ha/panels/lovelace/custom-card-helpers")>;
  }
}

console.log("Home Dashboard Loaded");
