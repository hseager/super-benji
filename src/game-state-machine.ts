import { StateMachine } from "./core/model/state-machine";
import { State } from "./core/types";

export let gameStateMachine: StateMachine;

export function createGameStateMachine(
  initialState: State,
  ...initialArguments: any[]
) {
  gameStateMachine = new StateMachine(initialState, ...initialArguments);
}
