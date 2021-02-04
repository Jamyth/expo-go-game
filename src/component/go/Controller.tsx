import React from "react";
import { useController } from "expo-go/recoil/Go";
import { Button } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Recoil from "recoil";
import { GameState } from "expo-go/recoil/Go";
import { View } from "react-native";

interface Props {
  toggleTerritory?: () => void;
}

export const Controller = React.memo(({ toggleTerritory }: Props) => {
  const { history, currentIndex } = Recoil.useRecoilValue(GameState);
  const length = history.length;
  const { toStart, toPrev, toNext, toEnd, deleteMove } = useController();
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Button
          appearance="ghost"
          onPress={toStart}
          style={{ flex: 1, borderRadius: 0 }}
          disabled={currentIndex === 0}
          accessoryLeft={() => (
            <AntDesign
              name="stepbackward"
              style={[styles.button, currentIndex === 0 ? styles.disabled : {}]}
            />
          )}
        />

        <Button
          appearance="ghost"
          onPress={toPrev}
          style={{ flex: 1, borderRadius: 0 }}
          disabled={currentIndex === 0}
          accessoryLeft={() => (
            <AntDesign
              name="caretleft"
              style={[styles.button, currentIndex === 0 ? styles.disabled : {}]}
            />
          )}
        />
        <Button
          appearance="ghost"
          onPress={toNext}
          style={{ flex: 1, borderRadius: 0 }}
          disabled={currentIndex === length - 1}
          accessoryLeft={() => (
            <AntDesign
              name="caretright"
              style={[
                styles.button,
                currentIndex === length - 1 ? styles.disabled : {},
              ]}
            />
          )}
        />
        <Button
          appearance="ghost"
          onPress={toEnd}
          style={{ flex: 1, borderRadius: 0 }}
          disabled={currentIndex === length - 1}
          accessoryLeft={() => (
            <AntDesign
              name="stepforward"
              style={[
                styles.button,
                currentIndex === length - 1 ? styles.disabled : {},
              ]}
            />
          )}
        />

        <Button
          appearance="ghost"
          style={{ flex: 1, borderRadius: 0 }}
          onPress={deleteMove}
          disabled={length === 1}
          accessoryLeft={() => (
            <Feather
              name="delete"
              style={[styles.button, length === 1 ? styles.disabled : {}]}
            />
          )}
        />
      </View>
      <View style={styles.container}>
        {toggleTerritory && (
          <Button
            appearance="ghost"
            style={{ flex: 1, borderRadius: 0 }}
            onPress={toggleTerritory}
          >
            領地
          </Button>
        )}
      </View>
    </React.Fragment>
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
