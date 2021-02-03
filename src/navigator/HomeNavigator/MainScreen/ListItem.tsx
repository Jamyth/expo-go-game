import React from "react";
import type { GameItem } from "expo-go/type/interface";
import {
  Button,
  OverflowMenu,
  MenuItem,
  IndexPath,
} from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { useCreateGame } from "expo-go/recoil/Go";
import { useSetNewGameState } from "expo-go/recoil/NewGame";
import { useNavigation } from "@react-navigation/native";
import { useGameListAction } from "expo-go/recoil/GameList";
import { Feather } from "@expo/vector-icons";
import { useBool } from "expo-go/util/useBool";

interface Props {
  item: GameItem;
}

const BUTTONS = [
  { text: "Delete", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" },
];

export const ListItem = React.memo(({ item }: Props) => {
  const enterGame = useCreateGame();
  const setGameConfig = useSetNewGameState();
  const navigation = useNavigation();
  const { deleteGame } = useGameListAction();
  const { show, on, off } = useBool(false);

  const onPress = () => {
    const { game, ...config } = item;
    enterGame({ ...game, currentIndex: game.history.length - 1 });
    setGameConfig((_) => config);
    navigation.navigate("Home.Game");
  };

  const onActionClick = async (indexPath: IndexPath) => {
    const index = indexPath.row;
    if (index === 0) {
      deleteGame(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <Button appearance="ghost" style={styles.main} onPress={onPress}>
        {item.matchName}
      </Button>
      <OverflowMenu
        visible={show}
        onBackdropPress={off}
        onSelect={onActionClick}
        anchor={() => (
          <Button
            appearance="ghost"
            style={styles.action}
            accessoryLeft={() => (
              <Feather name="more-horizontal" style={styles.icon} />
            )}
            onPress={on}
          />
        )}
      >
        <MenuItem title="Delete" />
      </OverflowMenu>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  main: {
    flex: 1,
    height: "100%",
  },
  action: {
    width: "20%",
    height: "100%",
  },
  icon: {
    fontSize: 20,
  },
});
