# Home Dashboard Strategy

A dashboard strategy for Home Assistant.

## Installation

### Requirements

- [Vertical Stack In Card](https://github.com/ofekashery/vertical-stack-in-card/tree/master)
- [Lovelace Card Mod](https://github.com/thomasloven/lovelace-card-mod)

### HACS (Recommended)

1. Open HACS in Home Assistant.
2. Go to **Frontend**.
3. Click the three dots in the top right corner and select **Custom repositories**.
4. Add the URL of this repository and select **Plugin** as the category.
5. Click **Add**.
6. Find "Home Dashboard Strategy" and click **Download**.

### Manual

1. Download `ha-home-dashboard-strategy.js` from the latest release.
2. Copy it to your `www` folder in Home Assistant.
3. Add the resource to your dashboard.

## Configuration

Both `wallboard` and `mobile` strategies share the same configuration options.

| Name | Type | Description |
| --- | --- | --- |
| `theme` | `string` | The theme to use for the dashboard. |
| `overview` | `object` | Configuration for the overview page. |
| `floors` | `object` | Configuration for individual floors. Keyed by floor ID. |
| `areas` | `object` | Configuration for individual areas. Keyed by area ID. |
| `lights` | `object` | Configuration for the lights view. |
| `climate` | `object` | Configuration for the climate view. |
| `media` | `object` | Configuration for the media view. |
| `security` | `object` | Configuration for the security view. |
| `utility` | `object` | Configuration for the utility view. |

### Overview Configuration

| Name | Type | Description |
| --- | --- | --- |
| `weather` | `string` | Entity ID of the weather entity to display. |
| `lights` | `object` | Configuration for the lights view. |
| `badges` | `list` | List of badges to display on the overview page. |

### Floor Configuration

| Name | Type | Description |
| --- | --- | --- |
| `lights` | `object` | Configuration for the lights view of this floor. |
| `badges` | `list` | List of badges to display for this floor. |

### Area Configuration

| Name | Type | Description |
| --- | --- | --- |
| `hidden` | `boolean` | Whether to hide the area from the dashboard. |
| `size` | `string` | Size of the area card. Can be `small` or `large`. |
| `lights` | `object` | Configuration for the lights view of this area. |
| `badges` | `list` | List of badges to display for this area. |
| `climate` | `object` | Configuration for the climate view of this area. |

### View Configuration

All views (`lights`, `climate`, `media`, `security`, `utility`) share these options:

| Name | Type | Description |
| --- | --- | --- |
| `hidden` | `boolean` | Whether to hide the view from the dashboard. |
| `order` | `object` | Custom order for entities in this view. Keyed by entity ID. |

### Lights Configuration

| Name | Type | Description |
| --- | --- | --- |
| `all` | `string` | Entity ID of a group containing all lights in the area/overview. |
| `hidden` | `boolean` | Whether to hide the lights view. |
| `order` | `object` | Custom order for entities in this view. Keyed by entity ID. |

### Example

```yaml
strategy:
  type: custom:wallboard
  theme: "Mushroom Square"
  overview:
    weather: weather.home
    badges:
      - entity: sensor.temperature
    lights:
      all: light.all_lights
  floors:
    ground:
      lights:
        all: light.ground_lights
      badges:
        - entity: sensor.ground_floor_temperature
  areas:
    living_room:
      size: large
      badges:
        - entity: binary_sensor.motion
      lights:
        all: light.living_room_lights
    bedroom:
      hidden: true
  climate:
    order:
      climate.living_room: 0
      climate.bedroom: 1
  security:
    hidden: true
```

### Wallboard

```yaml
strategy:
  type: custom:wallboard
```

### Mobile

```yaml
strategy:
  type: custom:mobile
```
