import type {LovelaceCardConfig} from "@ha/data/lovelace/config/card";
import type {HuiCard} from "@ha/panels/lovelace/cards/hui-card";
import type {LovelaceCard, LovelaceGridOptions,} from "@ha/panels/lovelace/types";
import type {HomeAssistant} from "@ha/types";
import type {PropertyValues} from "@lit/reactive-element";
import type {CSSResult} from "lit";
import {css, html, LitElement, nothing} from "lit";
import {customElement, property, state} from "lit/decorators.js";

interface VerticalStackInCardConfig extends LovelaceCardConfig {
  type: "vertical-stack-in-card";
  title?: string;
  cards: LovelaceCardConfig[];
  horizontal?: boolean;
  styles?: Record<string, string>;
}

@customElement("vertical-stack-in-card-2")
class VerticalStackInCard extends LitElement implements LovelaceCard {
  @state() private _config?: VerticalStackInCardConfig;

  @state() protected _cards?: HuiCard[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ type: Boolean }) public preview?: boolean;

  // oxlint-disable-next-line class-methods-use-this
  public getCardSize(): number | Promise<number> {
    return 1;
  }

  // oxlint-disable-next-line class-methods-use-this
  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      min_columns: 3,
      rows: "auto",
    };
  }

  public setConfig(config: VerticalStackInCardConfig): void {
    if (!config || !config.cards || !Array.isArray(config.cards)) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
    this._cards = config.cards.map((card) => this._createCardElement(card));
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (this._cards) {
      if (changedProperties.has("hass")) {
        for (const card of this._cards) {
          card.hass = this.hass;
        }
      }
      if (changedProperties.has("preview")) {
        for (const card of this._cards) {
          card.preview = this.preview ?? false;
        }
      }
    }
  }

  private _createCardElement(cardConfig: LovelaceCardConfig): HuiCard {
    const element = document.createElement("hui-card");
    element.hass = this.hass;
    element.preview = this.preview ?? false;
    element.config = cardConfig;
    element.load();
    return element;
  }

  protected render(): unknown {
    if (!this._config || !this._cards) {
      return nothing;
    }

    return html`
      <ha-card>
        <div id="root">
          ${this._cards}
        </div>
      </ha-card>
    `;
  }

  // oxlint-disable-next-line typescript/class-literal-property-style
  static get styles(): CSSResult {
    return css`
      #root {
        --ha-card-border-width: 0px;
        --ha-card-box-shadow: none;
        display: grid;
        gap: var(--row-gap, 8px);
      }

      #root hui-card {
        height: var(--row-height, auto);
      }
    `;
  }
}

export default VerticalStackInCard;
