export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;
}

export type UpgradeRarity = "Common" | "Rare" | "Epic" | "Legendary";

export type Upgrade = {
  rarity: UpgradeRarity;
  name: string;
  description: string;
  description2?: string;
  apply: () => void;
};

export type Coordinates = {
  y: number;
  x: number;
};
