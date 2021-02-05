import type { Stone } from "expo-go/recoil/Go";

type Size = 9 | 13 | 19;

interface EmptySpace {
  x: number;
  y: number;
}

export interface GameStatus {
  whiteTaken: number;
  blackTaken: number;
  whiteSpace: number;
  blackSpace: number;
}

export interface Territory extends EmptySpace {
  color: "black" | "white";
}

interface CleanBoard {
  board: Stone[];
  whiteTaken: number;
  blackTaken: number;
}

interface GetTerritoryResponse extends GameStatus {
  territory: Territory[][];
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

function getSpaceOrStone<T extends Stone | EmptySpace>(x: number, y: number) {
  return (_: T) => _.x === x && _.y === y;
}

function getNeighbors<T extends Stone | EmptySpace>(
  x: number,
  y: number,
  board: T[],
  diagonal: boolean = false
): T[] {
  const neighbors: T[] = [];

  const top = board.find(getSpaceOrStone(x, y - 1));
  const left = board.find(getSpaceOrStone(x - 1, y));
  const bottom = board.find(getSpaceOrStone(x, y + 1));
  const right = board.find(getSpaceOrStone(x + 1, y));

  if (diagonal) {
    const topLeft = board.find(getSpaceOrStone(x - 1, y - 1));
    const topRight = board.find(getSpaceOrStone(x + 1, y - 1));
    const bottomLeft = board.find(getSpaceOrStone(x - 1, y + 1));
    const bottomRight = board.find(getSpaceOrStone(x + 1, y + 1));

    topLeft && neighbors.push(topLeft);
    topRight && neighbors.push(topRight);
    bottomLeft && neighbors.push(bottomLeft);
    bottomRight && neighbors.push(bottomRight);
  }

  top && neighbors.push(top);
  left && neighbors.push(left);
  bottom && neighbors.push(bottom);
  right && neighbors.push(right);

  return neighbors;
}

function getGroup<T extends Stone | EmptySpace>(
  stoneOrSpace: T,
  board: T[],
  diagonal: boolean = false
) {
  const visited: T[] = [];
  const list: T[] = [];
  const queue: T[] = [stoneOrSpace];

  while (queue.length) {
    const _stone = queue.pop()!;
    if (visited.includes(_stone)) {
      continue;
    }
    const neighbors = getNeighbors(_stone.x, _stone.y, board, diagonal);
    neighbors.forEach((_) => {
      if ("color" in _) {
        if ((_ as Stone).color === (_stone as Stone).color) {
          queue.push(_);
        }
      } else {
        queue.push(_);
      }
    });
    visited.push(_stone);
    list.push(_stone);
  }
  return list;
}

function getSpaceByGroup(size: Size, currentBoard: Stone[]): EmptySpace[][] {
  let spaces = getEmptySpace(size, currentBoard);
  const groups: EmptySpace[][] = [];
  while (spaces.length) {
    const space = spaces.pop()!;
    const group = getGroup(space, spaces);
    // Check is public
    const left = getSideBorder(
      space.x,
      space.y,
      currentBoard,
      size,
      "left",
      true
    );
    const top = getSideBorder(
      space.x,
      space.y,
      currentBoard,
      size,
      "top",
      true
    );
    const right = getSideBorder(
      space.x,
      space.y,
      currentBoard,
      size,
      "right",
      true
    );
    const bottom = getSideBorder(
      space.x,
      space.y,
      currentBoard,
      size,
      "bottom",
      true
    );

    let numberOfBlack = 0;
    let numberOfWhite = 0;
    let undefined = 0;
    [left, right, top, bottom].forEach((stone) => {
      if (!stone) {
        undefined++;
      }
      if (stone?.color === "black") {
        numberOfBlack++;
      } else if (stone?.color === "white") {
        numberOfWhite++;
      }
    });
    if (numberOfBlack === 2 && numberOfWhite === 2) {
    } else if (
      (numberOfBlack > 1 && numberOfWhite === 0) ||
      (numberOfWhite > 1 && numberOfBlack === 0)
    ) {
      groups.push(group);
    }
    spaces = spaces.filter((_) => !group.includes(_));
  }

  return groups;
}

function getEye(size: Size, currentBoard: Stone[]): EmptySpace[][] {
  return getSpaceByGroup(size, currentBoard).filter((_) => _.length === 1);
}

function getStoneGroup(currentBoard: Stone[]): Stone[][] {
  let _boards = [...currentBoard];
  const groups: Stone[][] = [];
  while (_boards.length) {
    const space = _boards.pop()!;
    const group = getGroup(space, _boards, true);
    groups.push(group);
    _boards = _boards.filter((_) => !group.includes(_));
  }
  return groups;
}

function getTerritory(size: Size, board: Stone[]): GetTerritoryResponse {
  const { board: cleanBoard, whiteTaken, blackTaken } = removeDeadStone(
    size,
    board
  );
  const spaces = getSpaceByGroup(size, cleanBoard);
  const territories: Territory[][] = spaces.map((_) => {
    const space = _?.[0];
    if (!space) {
      return [];
    }
    const left = getSideBorder(space.x, space.y, cleanBoard, size, "left");
    const top = getSideBorder(space.x, space.y, cleanBoard, size, "top");
    const right = getSideBorder(space.x, space.y, cleanBoard, size, "right");
    const bottom = getSideBorder(space.x, space.y, cleanBoard, size, "bottom");
    if (left) {
      return _.map((space) => ({ ...space, color: left.color }));
    }
    if (top) {
      return _.map((space) => ({ ...space, color: top.color }));
    }
    if (right) {
      return _.map((space) => ({ ...space, color: right.color }));
    }
    if (bottom) {
      return _.map((space) => ({ ...space, color: bottom.color }));
    }
    return [];
  });
  const whiteSpace = territories.reduce(
    (prev, curr) => prev + (curr?.[0]?.color === "white" ? curr.length : 0),
    0
  );
  const blackSpace = territories.reduce(
    (prev, curr) => prev + (curr?.[0]?.color === "black" ? curr.length : 0),
    0
  );
  return {
    territory: territories,
    whiteTaken,
    blackTaken,
    whiteSpace,
    blackSpace,
  };
}

function getDeadStone(stone: Stone, board: Stone[], size: 9 | 13 | 19) {
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

    const neighbors = getNeighbors(_stone.x, _stone.y, board);
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
}

function getSideBorder(
  x: number,
  y: number,
  board: Stone[],
  size: Size,
  side: "left" | "top" | "right" | "bottom",
  nested: boolean = false
) {
  let _x = x;
  let _y = y;
  let stone: Stone | undefined = undefined;
  let incrementor = () => {};
  let checker = () => false;
  switch (side) {
    case "left":
      incrementor = () => _x--;
      checker = () => _x >= 0;
      break;
    case "top":
      incrementor = () => _y--;
      checker = () => _y >= 0;
      break;
    case "right":
      incrementor = () => _x++;
      checker = () => _x < size;
      break;
    case "bottom":
      incrementor = () => _y++;
      checker = () => _y < size;
      break;
  }
  while (checker() && !stone) {
    stone = board.find(getSpaceOrStone(_x, _y));
    if (!nested && stone && isDeadStone(stone, board, size)) {
      stone = undefined;
    }
    incrementor();
    // break;
  }

  return stone;
}

function isDeadStone(_stone: Stone, board: Stone[], size: Size) {
  let left: Stone | undefined = getSideBorder(
    _stone.x - 1,
    _stone.y,
    board,
    size,
    "left",
    true
  );
  let top: Stone | undefined = getSideBorder(
    _stone.x,
    _stone.y - 1,
    board,
    size,
    "top",
    true
  );
  let right: Stone | undefined = getSideBorder(
    _stone.x + 1,
    _stone.y,
    board,
    size,
    "right",
    true
  );
  let bottom: Stone | undefined = getSideBorder(
    _stone.x,
    _stone.y + 1,
    board,
    size,
    "bottom",
    true
  );
  let numberOfBlack = 0;
  [left, right, top, bottom].forEach((stone) => {
    if (!stone || stone?.color === "black") {
      numberOfBlack++;
    }
  });
  if (
    (numberOfBlack > 2 && _stone.color === "white") ||
    (numberOfBlack < 2 && _stone.color === "black")
  ) {
    return true;
  }
}

function removeDeadStone(size: Size, currentBoard: Stone[]): CleanBoard {
  let _board = [...currentBoard];
  let boardWithoutDeadStone: Stone[] = [...currentBoard];
  let whiteTaken = 0;
  let blackTaken = 0;
  while (_board.length) {
    const stone = _board.pop()!;
    const group = getDeadStone(stone, boardWithoutDeadStone, size);
    // All group of stones which has 1 health should consider dead
    if (group.liberties === 1) {
      const _stone = group.stones[0];
      boardWithoutDeadStone = boardWithoutDeadStone.filter(
        (_) => !group.stones.includes(_)
      );
      _board = boardWithoutDeadStone.filter((_) => !group.stones.includes(_));
      if (_stone.color === "black") {
        whiteTaken += group.stones.length;
      } else {
        blackTaken += group.stones.length;
      }
      // check if the stone
    } else if (group.stones.length === 1) {
      const _stone = group.stones[0];

      let left: Stone | undefined = getSideBorder(
        _stone.x - 1,
        _stone.y,
        boardWithoutDeadStone,
        size,
        "left",
        true
      );
      let top: Stone | undefined = getSideBorder(
        _stone.x,
        _stone.y - 1,
        boardWithoutDeadStone,
        size,
        "top",
        true
      );
      let right: Stone | undefined = getSideBorder(
        _stone.x + 1,
        _stone.y,
        boardWithoutDeadStone,
        size,
        "right",
        true
      );
      let bottom: Stone | undefined = getSideBorder(
        _stone.x,
        _stone.y + 1,
        boardWithoutDeadStone,
        size,
        "bottom",
        true
      );
      let numberOfBlack = 0;
      [left, right, top, bottom].forEach((stone) => {
        if (!stone || stone?.color === "black") {
          numberOfBlack++;
        }
      });
      if (
        (numberOfBlack > 2 && stone.color === "white") ||
        (numberOfBlack < 2 && stone.color === "black")
      ) {
        boardWithoutDeadStone = boardWithoutDeadStone.filter(
          (_) => !group.stones.includes(_)
        );
        _board = boardWithoutDeadStone.filter((_) => !group.stones.includes(_));
        if (_stone.color === "black") {
          whiteTaken += group.stones.length;
        } else {
          blackTaken += group.stones.length;
        }
      }
    }
    // if (group.liberties <= 2 && group.stones.length > 1) {
    //   // Consider dead
    //   const _stone = group.stones[0];
    //   boardWithoutDeadStone = boardWithoutDeadStone.filter(
    //     (_) => !group.stones.includes(_)
    //   );

    //   _board = boardWithoutDeadStone.filter((_) => !group.stones.includes(_));
    //   if (_stone.color === "black") {
    //     whiteTaken += group.stones.length;
    //   } else {
    //     blackTaken += group.stones.length;
    //   }
    // }
  }
  return {
    board: boardWithoutDeadStone,
    whiteTaken,
    blackTaken,
  };
}

export const GameUtil = Object.freeze({
  getEmptySpace,
  getEye,
  getSpaceByGroup,
  removeDeadStone,
  getTerritory,
});
