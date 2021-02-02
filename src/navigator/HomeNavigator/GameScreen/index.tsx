import { Container } from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { GoGame, Controller, Header } from "expo-go/component/go";
import { useCreateNewGameState } from "expo-go/recoil/NewGame";
import { useGameListAction } from "expo-go/recoil/GameList";
import { useGameState } from "expo-go/recoil/Go";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const GameScreen = React.memo(({ navigation }: Props) => {
  const matchName = useCreateNewGameState((state) => state.matchName);
  const { saveGame } = useGameListAction();
  const game = useGameState((state) => state);
  const config = useCreateNewGameState((state) => state);

  React.useEffect(() => {
    navigation.setOptions({
      title: matchName,
    });
  }, []);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", async (e) => {
      e.preventDefault();
      saveGame({
        ...config,
        game,
      });
      navigation.dispatch(e.data.action);
    });
  }, [navigation]);

  React.useEffect(() => {
    console.log("update");
  }, [game, config]);

  return (
    <Container>
      <Header />
      <GoGame />
      <Controller />
    </Container>
  );
});
