import Recoil from "recoil";
import { DateUtil } from "expo-go/util/DateUtil";

interface NewGameState {
  matchName: string;
  size: 9 | 13 | 19;
  player1: Player;
  player2: Player;
}

interface Player {
  name: string;
}

const initialState: NewGameState = {
  matchName: `Match on ${DateUtil.format(new Date())}`,
  size: 9,
  player1: {
    name: "Player 1",
  },
  player2: {
    name: "Player 2",
  },
};

export const CreateNewGameState = Recoil.atom<NewGameState>({
  key: "NewGameState",
  default: initialState,
});

// Hooks
export const useCreateNewGameState = <T>(fn: (state: NewGameState) => T): T => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  return fn(state);
};

export const useCreateNewGameAction = () => {
  const [state, setState] = Recoil.useRecoilState(CreateNewGameState);

  const updateSize = (size: NewGameState["size"]) => {
    setState({
      ...state,
      size,
    });
  };

  const updatePlayer1 = (player: Partial<NewGameState["player1"]>) => {
    setState({
      ...state,
      player1: {
        ...state.player1,
        ...player,
      },
    });
  };
  const updatePlayer2 = (player: Partial<NewGameState["player2"]>) => {
    setState({
      ...state,
      player2: {
        ...state.player2,
        ...player,
      },
    });
  };
  const updateMatchName = (matchName: string) => {
    setState({
      ...state,
      matchName,
    });
  };

  return {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
  };
};
