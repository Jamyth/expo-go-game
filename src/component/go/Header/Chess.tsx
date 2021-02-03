import React from "react";
import { StyleSheet, View } from "react-native";
// import { View } from "@ui-kitten/components";

interface Props {
  isActive: boolean;
  color: "black" | "white";
}

export const Chess = React.memo(({ isActive, color }: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.chess, styles[color]]} />
      {isActive && <View style={styles.active} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  chess: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  black: {
    backgroundColor: "#000",
  },
  white: {
    backgroundColor: "#fff",
  },
  active: {
    position: "absolute",
    width: 42,
    height: 42,
    borderColor: "#ff0000",
    borderWidth: 2,
    borderRadius: 50,
    zIndex: 2,
  },
});
