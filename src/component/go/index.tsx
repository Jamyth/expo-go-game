import React from "react";
import { Board } from "./Board";
import { ChessBoard } from "./ChessBoard";
import { View } from "native-base";
import { Dimensions } from "react-native";
import { Controller } from "./Controller";

interface Props {
  size: 9 | 13 | 19;
}

export const GoGame = React.memo(({ size }: Props) => {
  const width = Dimensions.get("screen").width;

  return (
    <View
      style={{
        width,
        height: width,
        position: "relative",
        backgroundColor: "#e8a92c",
      }}
    >
      <Board size={size} />
      <ChessBoard size={size} />
    </View>
  );
});

export { Controller };
