export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;
}

export type ItemType = "Hull" | "Wings" | "Booster" | "Cannon" | "Relic";

export type Item = {
  type: ItemType;
  name: string;
  description: string;
  apply: () => void;
};

export type Coordinates = {
  y: number;
  x: number;
};
