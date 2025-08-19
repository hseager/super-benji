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

export type ImageProperties = Coordinates & {
  width: number;
  height: number;
};

export type StoryLine = {
  speaker: Character;
  text: string;
};

export type StoryActs = "intro" | "act1" | "act2" | "act3" | "epilogue";
export type Character = "Benji" | "Maggie" | "Torx" | "Jackal";
