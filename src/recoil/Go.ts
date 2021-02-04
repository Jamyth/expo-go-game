import Recoil from "recoil";
import React from "react";
import { CreateNewGameState, useCreateNewGameState } from "./NewGame";

export type Player = "white" | "black";

export interface State {
  currentPlayer: Player;
  history: Round[];
  currentIndex: number;
  pass: number;
  error: string | null;
}

export interface Stone {
  x: number;
  y: number;
  color: Player;
  step: number | null;
}

interface Round {
  step: number;
  movement: Stone[];
  captured: StoneGroup[];
  move: Stone | null;
  blackTaken: number;
  whiteTaken: number;
}

const initialState: State = {
  currentPlayer: "black",
  history: [
    {
      step: 0,
      movement: [],
      captured: [],
      move: null,
      blackTaken: 0,
      whiteTaken: 0,
    },
  ],
  currentIndex: 0,
  pass: 0,
  error: null,
};

const getHandicap = (handicap: number, size: 9 | 13 | 19): Stone[] => {
  const _stone: Pick<Stone, "color" | "step"> = {
    color: "black",
    step: null,
  };
  switch (handicap) {
    case 1:
      return [{ ..._stone, x: size - 4, y: 3 }];
    case 2:
      return [
        ...getHandicap(1, size),
        {
          ..._stone,
          x: 3,
          y: size - 4,
        },
      ];
    case 3:
      return [
        ...getHandicap(2, size),
        {
          ..._stone,
          x: 3,
          y: 3,
        },
      ];
    case 4:
      return [
        ...getHandicap(3, size),
        {
          ..._stone,
          x: size - 4,
          y: size - 4,
        },
      ];
    case 5:
      return [
        ...getHandicap(4, size),
        {
          ..._stone,
          x: Math.floor(size / 2),
          y: Math.floor(size / 2),
        },
      ];
    case 6:
      return [
        ...getHandicap(4, size),
        {
          ..._stone,
          x: 3,
          y: Math.floor(size / 2),
        },
        {
          ..._stone,
          x: size - 4,
          y: Math.floor(size / 2),
        },
      ];
    case 7:
      return [
        ...getHandicap(6, size),
        {
          ..._stone,
          x: Math.floor(size / 2),
          y: Math.floor(size / 2),
        },
      ];
    case 8:
      return [
        ...getHandicap(6, size),
        {
          ..._stone,
          x: Math.floor(size / 2),
          y: 3,
        },
        {
          ..._stone,
          x: Math.floor(size / 2),
          y: size - 4,
        },
      ];
    case 9:
      return [
        ...getHandicap(8, size),
        {
          ..._stone,
          x: Math.floor(size / 2),
          y: Math.floor(size / 2),
        },
      ];
    case 0:
    default:
      return [];
  }
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

const isInKo = (
  lastMove: Stone | null,
  currentMove: Stone,
  lastCaptured: StoneGroup[],
  currentCaptured: StoneGroup[]
) => {
  return (
    lastMove &&
    currentCaptured.some(
      (_) =>
        _.stones.length === 1 &&
        _.stones[0].x === lastMove.x &&
        _.stones[0].y === lastMove.y
    ) &&
    lastCaptured.some(
      (_) =>
        _.stones.length === 1 &&
        _.stones[0].x === currentMove.x &&
        _.stones[0].y === currentMove.y
    )
  );
};

// Hooks
export const useGameState = <T>(fn: (state: State) => T): T => {
  const state = Recoil.useRecoilValue(GameState);
  return fn(state);
};

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
    if (_history.length === 1) {
      return;
    }
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
        history: _history,
        currentIndex: _history.length - 1,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
      });
    }
  };

  return { pass, toStart, toEnd, toPrev, toNext, deleteMove };
};

export const useSetError = () => {
  const [state, setState] = Recoil.useRecoilState(GameState);
  return (error: string | null) => {
    setState({
      ...state,
      error,
    });
  };
};

export const useSetPlayer = () => {
  const setState = Recoil.useSetRecoilState(GameState);
  return (player: Player) => setState((state) => ({ ...state, player }));
};

export const usePlaceStone = () => {
  const [state, setState] = Recoil.useRecoilState(GameState);
  const setError = useSetError();
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
      const movement = game.movement;
      const lastMove = game.move;
      const lastCaptured = game.captured;

      const isExist = movement.find(getStone(x, y));

      if (isExist) {
        // is occupied
        setError("不能下在這裡");
        return;
      }

      const stone: Stone = {
        x,
        y,
        color: state.currentPlayer,
        step: state.history.length,
      };

      const _game = [...movement, stone];

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

      if (isInKo(lastMove, stone, lastCaptured, captured)) {
        setError("打劫");
        return;
      }

      if (!captured.length && getGroup(stone, _game, size).liberties === 0) {
        // Suicide
        setError("禁入點");
        return;
      }

      const newState = _game.filter(
        (_) => !captured.some((group) => group.stones.includes(_))
      );

      const totalTaken = captured.reduce(
        (prev, curr) => prev + curr.stones.length,
        0
      );

      const isBlack = state.currentPlayer === "black";

      const newRound: Round = {
        blackTaken: isBlack ? game.blackTaken + totalTaken : game.blackTaken,
        whiteTaken: !isBlack ? game.whiteTaken + totalTaken : game.whiteTaken,
        captured,
        move: stone,
        step: state.history.length,
        movement: newState,
      };

      setState((state) => ({
        ...state,
        history: [...state.history, newRound],
        currentIndex: state.history.length,
        currentPlayer: state.currentPlayer === "black" ? "white" : "black",
        error: null,
      }));
    },
    [state]
  );
};

export const useCreateGame = () => {
  const setState = Recoil.useSetRecoilState(GameState);
  const handicap = useCreateNewGameState((state) => state.handicap);
  const size = useCreateNewGameState((state) => state.size);
  return (state?: State) => {
    if (!state) {
      const movement = getHandicap(handicap, size);
      const round: Round = {
        ...initialState.history[0],
        movement,
      };
      const _state: State = {
        ...initialState,
        history: [round],
        currentPlayer: "white",
      };
      setState((_) => _state);
      return;
    }
    setState((_) => state);
  };
};
