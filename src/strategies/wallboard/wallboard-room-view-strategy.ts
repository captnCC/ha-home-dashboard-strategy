import type {
    LovelaceViewConfig,
    LovelaceViewHeaderConfig,
} from "home-assistant-frontend-types/frontend/data/lovelace/config/view";
import type {HomeAssistant} from "home-assistant-frontend-types/frontend/types";
import type {AreaRegistryEntry} from "home-assistant-frontend-types/frontend/data/area/area_registry";
import {computeAreaTileCardConfig, extendLastCard} from "../helpers/cards";
import type {LovelaceBadgeConfig} from "home-assistant-frontend-types/frontend/data/lovelace/config/badge";
import {computeBadge} from "../helpers/badges";
import {AreaConfig, HasLightsConfig} from "../config";
import {generateEntityFilter} from "../../homeassistant/common/entity/entity_filter";
import {EntityBadgeConfig} from "home-assistant-frontend-types/frontend/panels/lovelace/badges/types";

export type WallboardRoomViewStrategyConfig = {
    type: "custom:wallboard-room";
    area: string;
} & AreaConfig

class WallboardRoomViewStrategy extends HTMLElement {
    static async generate(
        config: WallboardRoomViewStrategyConfig,
        hass: HomeAssistant
    ): Promise<LovelaceViewConfig> {
        const area = hass.areas[config.area];

        const header: LovelaceViewHeaderConfig = {
            card: {
                type: "markdown",
                content: `# <ha-icon icon="${area.icon}"></ha-icon> ${area.name}`,
                text_only: true,
            },
            layout: "start",
            badges_position: "bottom",
            badges_wrap: "wrap",
        };

        const badges = computeBadges(hass, area);

        if (config.badges) {
            badges.push(...config.badges);
        }

        const sections = [
            ...computeLightSection(hass, area, config.lights || {}),
            ...computeClimateSection(hass, area),
            ...computeMediaSection(hass, area),
        ];

        return {
            type: "sections",
            max_columns: 3,
            header,
            badges,
            sections,
        };
    }
}

const lightsHeading = (config: NonNullable<HasLightsConfig["lights"]>) => {
    const badges: EntityBadgeConfig[] = [];
    const allLights = config.all;
    if (allLights) {
        badges.push(computeBadge(allLights));
    }

    return ({
        type: "heading",
        heading: "Lights",
        heading_style: "subtitle",
        icon: "mdi:lightbulb-group",
        tap_action: {action: "navigate", navigation_path: "lights?historyBack=1"},
        badges
    });
};

const computeLightCards = (hass: HomeAssistant, area: AreaRegistryEntry) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const areaFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["light"],
    });

    const allEntities = Object.keys(hass.states);

    return allEntities.filter(areaFilter).map(computeTileCard);
};

const computeLightSection = (hass: HomeAssistant, area: AreaRegistryEntry, config: NonNullable<HasLightsConfig["lights"]>) => {
    const cards = extendLastCard(computeLightCards(hass, area));

    if (cards.length === 0) return [];
    return [
        {
            type: "grid",
            cards: [lightsHeading(config), ...cards],
        },
    ];
};

const climateHeading = () => ({
    type: "heading",
    heading: "Climate",
    heading_style: "subtitle",
    icon: "mdi:home-thermometer",
    tap_action: {action: "navigate", navigation_path: "climate?historyBack=1"},
});

const computeClimateCards = (hass: HomeAssistant, area: AreaRegistryEntry) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const devicesFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["climate", "fan"],
    });

    const sensorFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["sensor"],
        device_class: ["temperature", "humidity", "pm25", "co2", "aqi"],
    });

    const allEntities = Object.keys(hass.states);
    return extendLastCard(
        [
            ...allEntities.filter(devicesFilter),
            ...allEntities.filter(sensorFilter),
        ].map(computeTileCard)
    );
};

const computeClimateSection = (
    hass: HomeAssistant,
    area: AreaRegistryEntry
) => {
    const cards = extendLastCard(computeClimateCards(hass, area));

    if (cards.length === 0) return [];
    return [
        {
            type: "grid",
            cards: [climateHeading(), ...cards],
        },
    ];
};

const mediaHeading = () => ({
    type: "heading",
    heading: "Media",
    heading_style: "subtitle",
    icon: "mdi:play",
});

const computeMediaCards = (hass: HomeAssistant, area: AreaRegistryEntry) => {
    const computeTileCard = computeAreaTileCardConfig(hass, area.name);

    const areaFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["media_player"],
    });

    const allEntities = Object.keys(hass.states);
    return allEntities.filter(areaFilter).map(computeTileCard);
};

const computeMediaSection = (hass: HomeAssistant, area: AreaRegistryEntry) => {
    const cards = computeMediaCards(hass, area);

    if (cards.length === 0) return [];
    return [
        {
            type: "grid",
            cards: [mediaHeading(), ...cards],
        },
    ];
};

const computeBadges = (hass: HomeAssistant, area: AreaRegistryEntry) => {
    const badges: LovelaceBadgeConfig[] = [];

    if (area.temperature_entity_id) {
        badges.push({
            type: "entity",
            show_name: true,
            show_state: true,
            show_icon: true,
            entity: area.temperature_entity_id,
            name: "Temperature",
        });
    }

    if (area.humidity_entity_id) {
        badges.push({
            type: "entity",
            show_name: true,
            show_state: true,
            show_icon: true,
            entity: area.humidity_entity_id,
            name: "Humidity",
        });
    }

    const sceneFilter = generateEntityFilter(hass, {
        area: area.area_id,
        domain: ["scene"],
    });

    const sceneBadges = Object.keys(hass.states)
        .filter(sceneFilter)
        .map(computeBadge);

    badges.push(...sceneBadges);
    return badges;
}
customElements.define("ll-strategy-view-wallboard-room", WallboardRoomViewStrategy);