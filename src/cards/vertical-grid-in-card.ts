// oxlint-disable max-lines-per-function
import type {LovelaceCardConfig} from "@ha/data/lovelace/config/card";
import type {HuiCard} from "@ha/panels/lovelace/cards/hui-card";
import type {LovelaceCard, LovelaceGridOptions} from "@ha/panels/lovelace/types";
import type {HomeAssistant} from "@ha/types";
import type {PropertyValues} from "@lit/reactive-element";
import type {CSSResult} from "lit";
import {css, html, LitElement, nothing} from "lit";

import {computeCardGridSize} from "@ha/panels/lovelace/common/compute-card-grid-size";
import {computeCardSize} from "@ha/panels/lovelace/common/compute-card-size";
import {customElement, property, state} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";

interface VerticalStackInCardConfig extends LovelaceCardConfig {
  type: "vertical-grid-in-card";
  title?: string;
  cards: LovelaceCardConfig[];
  horizontal?: boolean;
  styles?: Record<string, string>;
}

@customElement("vertical-grid-in-card")
class VerticalGridInCard extends LitElement implements LovelaceCard {
  @state() private _config?: VerticalStackInCardConfig;

  @state() protected _cards?: HuiCard[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ type: Boolean }) public preview?: boolean;

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
          ${repeat(
            this._cards,
            (card, idx) => idx,
            (card) => {
              card.layout = "grid";
              const gridOptions = card.getGridOptions();

              const { rows } = computeCardGridSize(gridOptions);

              return html`
              <div class="card fit-rows full-width" style="--row-size:${rows}">
                ${card}
              </div>
            `;
            },
          )}
          
        </div>
      </ha-card>
    `;
  }

  public async getCardSize(): Promise<number> {
    if (!this._cards || !this._config) {
      return 0;
    }

    const promises: (Promise<number> | number)[] = [];

    for (const element of this._cards) {
      promises.push(computeCardSize(element));
    }

    const cardSizes = await Promise.all(promises);

    let totalHeight = this._config.title ? 1 : 0;

    // Each column will adjust to max card size of it's row
    for (let start = 0; start < cardSizes.length; start += 1) {
      totalHeight += Math.max(...cardSizes.slice(start, start + 1));
    }

    return totalHeight;
  }

  // oxlint-disable-next-line typescript/class-literal-property-style
  static get styles(): CSSResult {
    return css`
      #root {
        --ha-card-border-width: 0px;
        --ha-card-box-shadow: none;
      }

      #root hui-card {
        min-height: var(--row-height, auto);
      }

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      #root {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(var(--grid-card-column-count, 1), minmax(0, 1fr));
        grid-gap: var(--grid-card-gap, 8px);
      }

      .card {
        height: calc((var(--row-size, 1) * (var(--row-height) + var(--row-gap))) - var(--row-gap));
      }
      :host([square]) #root {
        grid-auto-rows: 1fr;
      }
      :host([square]) #root::before {
        content: "";
        width: 0;
        padding-bottom: 100%;
        grid-row: 1 / 1;
        grid-column: 1 / 1;
      }

      :host([square]) #root > *:not([hidden]) {
        display: block;
        grid-row: 1 / 1;
        grid-column: 1 / 1;
      }
      :host([square]) #root > *:not([hidden]) ~ *:not([hidden]) {
        /*
         * Remove grid-row and grid-column from every element that comes after
         * the first not-hidden element
         */
        grid-row: unset;
        grid-column: unset;
      }
    `;
  }
}

export default VerticalGridInCard;
