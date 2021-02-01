import Recoil from "recoil";
import React from "react";
import { CreateNewGameState } from "./NewGame";

export type Player = "white" | "black";

interface State {
  currentPlayer: Player;
  history: Stone[][];
  currentIndex: number;
  pass: number;
}

interface Stone {
  x: number;
  y: number;
  color: Player;
  step: number;
}

const initialState: State = {
  currentPlayer: "black",
  history: [[]],
  currentIndex: 0,
  pass: 0,
};

interface StoneGroup {
  liberties: number;
  stones: Stone[];
}

export const GameState = Recoil.atom({
  key: "GameState",
  default: initialState,
});

// Util
const getStone = (x: number, y: number) => (_: Stone) => _.x === x && _.y === y;

const getNeighbors = (x: number, y: number, game: Stone[]): Stone[] => {
  const neighbors: Stone[] = [];

  const top = game.find(getStone(x, y - 1));
  const left = game.find(getStone(x - 1, y));
  const bottom = game.find(getStone(x, y + 1));
  const right = game.find(getStone(x + 1, y));

  top && neighbors.push(top);
  left && neighbors.push(left);
  bottom && neighbors.push(bottom);
  right && neighbors.push(right);

  return neighbors;
};

const getGroup = (
  stone: Stone,
  game: Stone[],
  size: 9 | 13 | 19
): StoneGroup => {
  const color = stone.color;

  const visited: Stone[] = [];
  const list: Stone[] = [];
  const queue: Stone[] = [stone];
  let count = 0;

  while (queue.length) {
    const _stone = queue.pop()!;
    if (visited.includes(_stone)) {
      continue;
    }

    const neighbors = getNeighbors(_stone.x, _stone.y, game);
    let ki = 4;
    const x = _stone.x;
    const y = _stone.y;
    // Top & Bottom
    if (y === 0 || y === size - 1) {
      // Corner
      if (x === 0 || x === size - 1) {
        ki = 2;
      } else {
        ki = 3;
      }
    }
    // Left & Right
    if (x === 0 || x === size - 1) {
      if (y === 0 || y === size - 1) {
        ki = 2;
      } else {
        ki = 3;
      }
    }
    count += ki - neighbors.length;
    neighbors.forEach((_) => {
      if (_.color === color) {
        queue.push(_);
      }
    });

    visited.push(_stone);
    list.push(_stone);
  }

  return {
    liberties: count,
    stones: list,
  };
};

// Hooks
export const useController = () => {
  const [state, setState] = Recoil.useRecoilState(GameState);

  const pass = React.useCallback(() => {
    if (state.pass === 1) {
      // End Game;
      return;
    }
    setState({
      ...state,
      pass: state.pass + 1,
      currentPlayer: state.currentPlayer === "black" ? "white" : "black",
    });
  }, [state]);

  const toStart = () => {
    setState({
      ...state,
      currentIndex: 0,
    });
  };

  const toEnd = () => {
    setState({
      ...state,
      currentIndex: state.history.length - 1,
    });
  };

  const toPrev = () => {
    if (state.currentIndex - 1 >= 0) {
      setState({
        ...state,
        currentIndex: state.currentIndex - 1,
      });
    }
  };

  const toNext = () => {
    if (state.currentIndex + 1 < state.history.length) {
      setState({
        ...state,
        currentIndex: state.currentIndex + 1,
      });
    }
  };

  const deleteMove = () => {
    const _history = [...state.history];
    const gameIndex = _history.length - 1;
    if (state.currentIndex !== gameIndex) {
      setState({
        ...state,
        currentIndex: gameIndex,
      });
      return;
    }
    const canDelete = _history.pop();
    if (canDelete) {
      setState({
        ...state,
        history: _history.length === 0 ? [[]] : _history,
        currentIndex: _history.length - 1 ? _history.length - 1 : 0,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
      });
    }
  };

  return { pass, toStart, toEnd, toPrev, toNext, deleteMove };
};

export const useSetPlayer = () => {
  const setState = Recoil.useSetRecoilState(GameState);
  return (player: Player) => setState((state) => ({ ...state, player }));
};

export const usePlaceStone = () => {
  const [state, setState] = Recoil.useRecoilState(GameState);
  const size = Recoil.useRecoilValue(CreateNewGameState).size;
  return React.useCallback(
    (x: number, y: number) => {
      const gameIndex = state.history.length - 1;

      if (state.currentIndex !== gameIndex) {
        setState({
          ...state,
          currentIndex: gameIndex,
        });
        return;
      }

      const game = state.history[gameIndex];

      const isExist = game.find(getStone(x, y));

      if (isExist) {
        // is occupied
        return;
      }

      const stone: Stone = {
        x,
        y,
        color: state.currentPlayer,
        step: state.history.length,
      };

      const _game = [...game, stone];

      const neighbors = getNeighbors(x, y, _game);

      const captured: StoneGroup[] = [];

      neighbors.forEach((stone) => {
        if (stone.color !== state.currentPlayer) {
          const group = getGroup(stone, _game, size);
          if (group.liberties === 0) {
            captured.push(group);
          }
        }
      });

      if (!captured.length && getGroup(stone, _game, size).liberties === 0) {
        // Suicide
        return;
      }

      const newState = _game.filter(
        (_) => !captured.some((group) => group.stones.includes(_))
      );

      setState((state) => ({
        ...state,
        history: [...state.history, newState],
        currentIndex: state.history.length,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
      }));
    },
    [state]
  );
};

export const useCreateGame = () => {
  const setState = Recoil.useSetRecoilState(GameState);
  return () => setState(initialState);
};
