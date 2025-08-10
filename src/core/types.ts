export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;
}

export type UpgradeOption = {
  name: string;
  description: string;
  apply: () => void;
};
