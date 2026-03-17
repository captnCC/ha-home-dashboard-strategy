import type { LovelaceViewHeaderConfig } from 'home-assistant-frontend-types/frontend/data/lovelace/config/view'

export const mobileHeader: Partial<LovelaceViewHeaderConfig> = {
  layout: 'start',
  badges_position: 'bottom',
  badges_wrap: 'scroll',
}

export const wallboardHeader: Partial<LovelaceViewHeaderConfig> = {
  layout: 'responsive',
  badges_position: 'bottom',
  badges_wrap: 'wrap',
}
