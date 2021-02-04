import Recoil from "recoil";
import { DateUtil } from "expo-go/util/DateUtil";
export interface NewGameState {
  id: string;
  matchName: string;
  size: 9 | 13 | 19;
  player1: Player;
  player2: Player;
  handicap: number;
}

interface Player {
  name: string;
}

const getInitialState = (): NewGameState => {
  return {
    id: `${Date.now()}`,
    matchName: `Match on ${DateUtil.format(new Date())}`,
    size: 9,
    player1: {
      name: "Player 1",
    },
    player2: {
      name: "Player 2",
    },
    handicap: 0,
  };
};

export const CreateNewGameState = Recoil.atom<NewGameState>({
  key: "NewGameState",
  default: getInitialState(),
});

// Hooks
export const useSetNewGameState = () => {
  const setState = Recoil.useSetRecoilState(CreateNewGameState);
  return setState;
};

export const useCreateNewGameState = <T>(fn: (state: NewGameState) => T): T => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  return fn(state);
};

export const useCreateNewGameAction = () => {
  const [state, setState] = Recoil.useRecoilState(CreateNewGameState);

  const resetCreateNewGameState = () => {
    setState(getInitialState());
  };

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
  const updateHandicap = (handicap: number) => {
    setState({
      ...state,
      handicap,
    });
  };

  return {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
    resetCreateNewGameState,
    updateHandicap,
  };
};
