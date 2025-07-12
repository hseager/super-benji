export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;
}

// Convert Enum to object with type so closure doesn't delete it
// export const Mode = {
//   Playing: 1,
//   PlaceUnit: 2,
//   IonCannon: 3,
// };
