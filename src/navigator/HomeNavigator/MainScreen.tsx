import { Container, Fab } from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "react-native";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const MainScreen = React.memo(({ navigation }: Props) => {
  const navigateToCreate = () => {
    navigation.navigate("Home.Create");
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Fab active position="bottomRight" onPress={navigateToCreate}>
        <MaterialIcons name="create" size={24} />
      </Fab>
    </Container>
  );
});
