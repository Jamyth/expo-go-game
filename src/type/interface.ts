import type { State as GameState } from "expo-go/recoil/Go";
import type { NewGameState } from "expo-go/recoil/NewGame";

export interface GameItem extends NewGameState {
  game: GameState;
}
