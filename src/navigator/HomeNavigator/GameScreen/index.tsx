import { Container, Content, Text } from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { GoGame, Controller } from "expo-go/component/go";
import Recoil from "recoil";
import { CreateNewGameState } from "expo-go/recoil/NewGame";
import { StatusBar } from "react-native";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const GameScreen = React.memo(({ navigation }: Props) => {
  const { size } = Recoil.useRecoilValue(CreateNewGameState);
  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <GoGame size={size} />
      <Controller />
    </Container>
  );
});
