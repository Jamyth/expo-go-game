import React from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
  RouteProp,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import { MainScreen } from "./MainScreen";
import { CreateScreen } from "./CreateScreen";
import { GameScreen } from "./GameScreen";
import { EditScreen } from "./EditScreen";

export type HomeStackParamList = {
  "Home.Main": undefined;
  "Home.Create": undefined;
  "Home.Game": undefined;
  "Home.Edit": undefined;
};

export type HomeNavigatorScreenProps<T extends keyof HomeStackParamList> = {
  route: RouteProp<HomeStackParamList, T>;
  navigation: StackNavigationProp<HomeStackParamList, T>;
};

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = React.memo(() => {
  const navRef = React.useRef<NavigationContainerRef>(null);

  return (
    <NavigationContainer ref={navRef}>
      <Navigator initialRouteName="Home.Main">
        <Screen
          name="Home.Main"
          options={{ title: "對局列表" }}
          component={MainScreen}
        />
        <Screen
          name="Home.Create"
          options={{ title: "新增對局" }}
          component={CreateScreen}
        />
        <Screen
          name="Home.Edit"
          options={{ title: "編輯對局" }}
          component={EditScreen}
        />
        <Screen name="Home.Game" component={GameScreen} />
      </Navigator>
    </NavigationContainer>
  );
});
