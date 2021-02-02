import Recoil from "recoil";
import type { GameItem } from "expo-go/type/interface";

interface State {
  isLoading: boolean;
  list: GameItem[];
}

const initialState: State = {
  isLoading: true,
  list: [],
};

export const GameListState = Recoil.atom({
  key: "GameListState",
  default: initialState,
});

// Hooks
export const useGameListState = () => {
  const value = Recoil.useRecoilValue(GameListState);
  return value;
};

export const useGameListAction = () => {
  const [state, setState] = Recoil.useRecoilState(GameListState);

  const setList = (list: GameItem[]) => {
    setState((state) => ({
      ...state,
      list: list.slice(0),
    }));
  };

  const saveGame = (gameItem: GameItem) => {
    const _list = [...state.list];
    const isExist = _list.find((_) => _.id === gameItem.id);
    if (!isExist) {
      _list.unshift(gameItem);
      // console.log(_list.map((_) => _.id));
      setList(_list);
      return;
    }
    const index = _list.indexOf(isExist);
    _list.splice(index, 1);
    _list.unshift(gameItem);
    setList(_list);
  };

  const deleteGame = (id: string) => {
    const _list = [...state.list];
    const isExist = _list.find((_) => _.id === id);
    if (isExist) {
      const index = _list.indexOf(isExist);
      _list.splice(index, 1);
      setList(_list);
    }
  };

  return {
    setList,
    saveGame,
    deleteGame,
  };
};
