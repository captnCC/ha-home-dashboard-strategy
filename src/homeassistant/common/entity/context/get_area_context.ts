import { AreaRegistryEntry } from "home-assistant-frontend-types/frontend/data/area/area_registry";
import { FloorRegistryEntry } from "home-assistant-frontend-types/frontend/data/floor_registry";
import { HomeAssistant } from "home-assistant-frontend-types/frontend/types";

interface AreaContext {
  area: AreaRegistryEntry | null;
  floor: FloorRegistryEntry | null;
}
export const getAreaContext = (
  area: AreaRegistryEntry,
  hassFloors: HomeAssistant["floors"],
): AreaContext => {
  const floorId = area.floor_id;
  const floor = floorId ? hassFloors[floorId] : undefined;

  return {
    area: area,
    floor: floor || null,
  };
};
