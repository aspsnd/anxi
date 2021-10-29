import type { StandardAction } from "../";

export function getCurrent(action: StandardAction, time: number) {
  let max = action.length;
  const current = time % max;
  return action.value[current];
}