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

```yaml
strategy:
  type: custom:wallboard
```
