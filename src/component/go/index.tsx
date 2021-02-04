import React from "react";
import { Board } from "./Board";
import { ChessBoard } from "./ChessBoard";
// import { View } from "@ui-kitten/components";
import { Dimensions, View } from "react-native";
import { Controller } from "./Controller";
import { Header } from "./Header";
import { useCreateNewGameState } from "expo-go/recoil/NewGame";

interface Props {
  territory?: {
    x: number;
    y: number;
  }[];
}

export const GoGame = React.memo(({ territory }: Props) => {
  const size = useCreateNewGameState((state) => state.size);
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
      <ChessBoard size={size} territory={territory} />
    </View>
  );
});

export { Controller, Header };
