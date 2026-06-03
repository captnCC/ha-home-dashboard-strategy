# Home Dashboard Strategy

[![GitHub Release](https://img.shields.io/github/v/release/captnCC/ha-home-dashboard-strategy?style=flat-square)](https://github.com/captnCC/ha-home-dashboard-strategy/releases)

The out-of-the-box dashboard for Home Assistant.

## Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=captnCC&repository=ha-home-dashboard-strategy&category=plugin)

### Requirements

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

## Features

- Area-centric overview
- Per-area views
- Per-floor views
- Category views for lights, climate, media, security and utilities
- Multi-floor support
- Tablet & mobile versions

## Configuration

Both `wallboard` and `mobile` strategies share the same configuration options.

```yaml
type*: custom:wallboard|mobile
theme: string # For examlpe "Mushroom Square"
overview:
  weather: string # Entity ID of a weather entity e.g. weather.openweathermap
  lights:
    all: string # Entity ID of a light group that controls all lights
    hidden: boolean
    order: object
  badges: list # List of custom badges
floors: # Optional set to false to disable multi-floor support
  floor_id:
    lights:
      all: string # Entity ID of a light group that controls all lights for the floor
      order: object
    badges: list # List of custom badges
  ...
areas:
  area_id:
    hidden: boolean
    size: string # small | large
    lights:
      all: string
      hidden: boolean
      order: object
    badges: list
    climate:
      hidden: boolean
      order: object
  ...
lights:
  all: string # Entity ID of a light group that controls all lights
  hidden: boolean
  order: object
climate:
  hidden: boolean
  order: object
media:
  hidden: boolean
  order: object
security:
  hidden: boolean
  order: object
utility:
  hidden: boolean
  order: object
```

### Overview Configuration

```yaml
[weather]: string
[lights]:
  [all]: string
  [hidden]: boolean
  [order]: object
[badges]: list
```

### Floor Configuration

```yaml
[lights]:
  [all]: string
  [hidden]: boolean
  [order]: object
[badges]: list
```

### Area Configuration

```yaml
[hidden]: boolean
[size]: string # small | large
[lights]:
  [all]: string
  [hidden]: boolean
  [order]: object
[badges]: list
[climate]:
  [hidden]: boolean
  [order]: object
```

### View Configuration

All views (`lights`, `climate`, `media`, `security`, `utility`) share these options:

```yaml
[hidden]: boolean
[order]: object
```

### Lights Configuration

```yaml
[all]: string
[hidden]: boolean
[order]: object
```

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
