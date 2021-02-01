import { Container } from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { GoGame, Controller, Header } from "expo-go/component/go";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const GameScreen = React.memo(({ navigation }: Props) => {
  return (
    <Container>
      <Header />
      <GoGame />
      <Controller />
    </Container>
  );
});
