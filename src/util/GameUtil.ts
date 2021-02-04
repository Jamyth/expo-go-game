import type { Stone } from "expo-go/recoil/Go";

type Size = 9 | 13 | 19;

interface EmptySpace {
  x: number;
  y: number;
}

function getEmptySpace(size: Size, currentBoard: Stone[]): EmptySpace[] {
  const board = [...new Array(size ** 2)].map((_, i) => {
    const x = Math.floor(i / size);
    const y = i % size;
    return {
      x,
      y,
    };
  });

  return board.filter(
    (_) => !currentBoard.find((stone) => stone.x === _.x && stone.y === _.y)
  );
}

export const GameUtil = Object.freeze({
  getEmptySpace,
});
