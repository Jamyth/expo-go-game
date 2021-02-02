import React from "react";
import type { GameItem } from "expo-go/type/interface";
import { View, Text, Button, ActionSheet } from "native-base";
import { StyleSheet } from "react-native";
import { useCreateGame } from "expo-go/recoil/Go";
import { useSetNewGameState } from "expo-go/recoil/NewGame";
import { useNavigation } from "@react-navigation/native";
import { useGameListAction, useGameListState } from "expo-go/recoil/GameList";
import { Feather } from "@expo/vector-icons";

interface Props {
  id: string;
}

const BUTTONS = [
  { text: "Delete", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" },
];

export const ListItem = React.memo(({ id }: Props) => {
  const enterGame = useCreateGame();
  const { list } = useGameListState();
  const setGameConfig = useSetNewGameState();
  const navigation = useNavigation();
  const { deleteGame } = useGameListAction();

  const onPress = () => {
    const item = list.find((_) => _.id === id);
    if (!item) {
      return;
    }
    const { game, ...config } = item;
    enterGame({ ...game, currentIndex: game.history.length - 1 });
    setGameConfig((_) => config);
    navigation.navigate("Home.Game");
  };

  const onActionSheetOpen = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
      },
      onActionClick
    );
  };

  const onActionClick = async (index: number) => {
    if (index === 0) {
      deleteGame(id);
    }
  };

  return (
    <View style={styles.container}>
      <Button transparent style={styles.main} onPress={onPress}>
        <View>
          <Text>{id}</Text>
        </View>
      </Button>
      <Button transparent style={styles.action} onPress={onActionSheetOpen}>
        <View>
          <Feather name="more-horizontal" style={styles.icon} />
        </View>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  main: {
    flex: 1,
    height: "100%",
  },
  action: {
    height: "100%",
  },
  icon: {
    fontSize: 20,
  },
});
