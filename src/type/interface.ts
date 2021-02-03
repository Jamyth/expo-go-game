import type { State as GameState } from "expo-go/recoil/Go";
import type { NewGameState } from "expo-go/recoil/NewGame";
import React from "react";

export type SafeReactChild = React.ReactChild | boolean | undefined;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];
export interface GameItem extends NewGameState {
  game: GameState;
}

export interface ControlledFormValue<T> {
  value: T;
  onChange: (value: T) => void;
}
