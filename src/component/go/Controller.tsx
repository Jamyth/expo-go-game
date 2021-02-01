import React from "react";
import { useController } from "expo-go/recoil/Go";
import { Button, View } from "native-base";
import { StyleSheet } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Recoil from "recoil";
import { GameState } from "expo-go/recoil/Go";

export const Controller = React.memo(() => {
  const { history, currentIndex } = Recoil.useRecoilValue(GameState);
  const length = history.length;
  const { toStart, toPrev, toNext, toEnd, deleteMove } = useController();
  return (
    <View style={styles.container}>
      <Button
        onPress={toStart}
        style={{ flex: 1 }}
        disabled={currentIndex === 0}
        full
        transparent
      >
        <AntDesign
          name="stepbackward"
          style={[styles.button, currentIndex === 0 ? styles.disabled : {}]}
        />
      </Button>
      <Button
        full
        transparent
        onPress={toPrev}
        style={{ flex: 1 }}
        disabled={currentIndex === 0}
      >
        <AntDesign
          name="caretleft"
          style={[styles.button, currentIndex === 0 ? styles.disabled : {}]}
        />
      </Button>
      <Button
        full
        transparent
        onPress={toNext}
        style={{ flex: 1 }}
        disabled={currentIndex === length - 1}
      >
        <AntDesign
          name="caretright"
          style={[
            styles.button,
            currentIndex === length - 1 ? styles.disabled : {},
          ]}
        />
      </Button>
      <Button
        full
        transparent
        onPress={toEnd}
        style={{ flex: 1 }}
        disabled={currentIndex === length - 1}
      >
        <AntDesign
          name="stepforward"
          style={[
            styles.button,
            currentIndex === length - 1 ? styles.disabled : {},
          ]}
        />
      </Button>
      <Button
        style={{ flex: 1 }}
        full
        transparent
        onPress={deleteMove}
        disabled={length === 1}
      >
        <Feather
          name="delete"
          style={[styles.button, length === 1 ? styles.disabled : {}]}
        />
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    flexDirection: "row",
  },
  button: {
    fontSize: 24,
  },
  disabled: {
    color: "#555",
  },
});
