import { useGameState, usePlaceStone, useSetError } from "expo-go/recoil/Go";
import { Text } from "@ui-kitten/components";
import React from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";

interface Props {
  size: 9 | 13 | 19;
}

const width = Dimensions.get("screen").width;

export const ChessBoard = React.memo(({ size }: Props) => {
  const { history, currentIndex, error } = useGameState((state) => state);

  const setError = useSetError();
  const place = usePlaceStone();

  const game = history[currentIndex].movement;

  const unitWidth = width / size;

  const fontSize = React.useMemo(() => {
    switch (size) {
      case 9:
        return 20;
      case 13:
        return 15;
      case 19:
        return 10;
    }
  }, [size]);

  const onPress = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.locationX;
    const y = e.nativeEvent.locationY;
    const snappedX = Math.floor(x / unitWidth);
    const snappedY = Math.floor(y / unitWidth);
    // TODO: Add Preview Mode
    place(snappedX, snappedY);
  };

  return (
    <React.Fragment>
      <TouchableOpacity onPress={onPress} style={styles.button} />
      {error && (
        <TouchableOpacity onPress={() => setError(null)} style={styles.overlay}>
          <Text style={styles.errorText}>{error}</Text>
        </TouchableOpacity>
      )}
      {game.map((stone) => {
        const left = stone.x * unitWidth + 1;
        const top = stone.y * unitWidth + 1;
        const width = unitWidth - 2;
        const backgroundColor = stone.color === "black" ? "#000" : "#fff";

        return (
          <View
            style={[
              styles.stone,
              {
                top,
                left,
                width,
                height: width,
                backgroundColor,
              },
            ]}
            key={stone.step}
          >
            <View style={styles.stoneContainer}>
              {stone.step === currentIndex && (
                <View
                  style={[
                    styles.flag,
                    {
                      borderRightWidth: unitWidth * 0.3,
                      borderTopWidth: unitWidth * 0.3,
                    },
                  ]}
                />
              )}
              <Text
                style={{
                  color: stone.color === "black" ? "#fff" : "#000",
                  fontSize,
                }}
              >
                {stone.step}
              </Text>
            </View>
          </View>
        );
      })}
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    zIndex: 2,
    width,
    height: width,
  },
  overlay: {
    position: "absolute",
    width,
    height: width,
    zIndex: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#000",
    padding: 5,
  },
  stone: {
    borderRadius: 50,
    zIndex: 3,
    position: "absolute",
  },
  stoneContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  flag: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightColor: "transparent",
    borderTopColor: "red",
  },
});
