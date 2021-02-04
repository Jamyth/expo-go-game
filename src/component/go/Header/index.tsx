import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { useGameState } from "expo-go/recoil/Go";
import { useCreateNewGameState } from "expo-go/recoil/NewGame";
import { Chess } from "./Chess";
import { GameStatus } from "expo-go/util/GameUtil";

interface Props {
  gameStatus?: GameStatus;
}

export const Header = React.memo(({ gameStatus }: Props) => {
  const { currentPlayer, history, currentIndex } = useGameState(
    (state) => state
  );
  const { player1, player2, komi } = useCreateNewGameState((state) => state);

  const { blackTaken, whiteTaken, step } = history[currentIndex];

  const isBlack = currentPlayer === "black";

  const getGameStatus = () => {
    if (!gameStatus) {
      return "";
    }
    const blackTerritory =
      gameStatus.blackSpace - whiteTaken - gameStatus.whiteTaken - (komi || 0);
    const whiteTerritory =
      gameStatus.whiteSpace - blackTaken - gameStatus.blackTaken;
    return `${blackTerritory > whiteTerritory ? "黑棋" : "白棋"}領先${Math.abs(
      blackTerritory - whiteTerritory
    )}子`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.black}>
        <Chess isActive={isBlack} color="black" />
        <View>
          <Text>{player1.name}</Text>
          <Text>提子：{blackTaken}</Text>
        </View>
      </View>
      <View style={styles.indicator}>
        <Text>第 {step} 手</Text>
        {/* <Text>VS</Text> */}
        <Text>{getGameStatus()}</Text>
      </View>
      <View style={styles.white}>
        <View>
          <Text>{player2.name}</Text>
          <Text>提子：{whiteTaken}</Text>
        </View>
        <Chess isActive={!isBlack} color="white" />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  indicator: {
    alignItems: "center",
  },
  black: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
  },
  white: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
  currentPlayer: {},
});
