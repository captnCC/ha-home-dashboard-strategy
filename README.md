# Home Dashboard Strategy

A dashboard strategy for Home Assistant.

## Installation

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
| `areas` | `object` | Configuration for individual areas. Keyed by area ID. |

### Overview Configuration

| Name | Type | Description |
| --- | --- | --- |
| `lights` | `object` | Configuration for the lights view. |
| `badges` | `list` | List of badges to display on the overview page. |

### Area Configuration

| Name | Type | Description |
| --- | --- | --- |
| `hidden` | `boolean` | Whether to hide the area from the dashboard. |
| `lights` | `object` | Configuration for the lights view of this area. |
| `badges` | `list` | List of badges to display for this area. |

### Lights Configuration

| Name | Type | Description |
| --- | --- | --- |
| `all` | `string` | Entity ID of a group containing all lights in the area/overview. |

### Example

```yaml
strategy:
  type: custom:wallboard
  theme: "Caule Black"
  overview:
    badges:
      - entity: sensor.temperature
    lights:
      all: light.all_lights
  areas:
    living_room:
      badges:
        - entity: binary_sensor.motion
      lights:
        all: light.living_room_lights
    bedroom:
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
