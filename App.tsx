import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeNavigator } from "./src/navigator/HomeNavigator";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { Ionicons } from "@expo/vector-icons";
import Recoil from "recoil";
import { Root } from "native-base";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
  };

  const loadAsset = async () => {
    await Promise.all([loadFont()]);
    setIsReady(true);
  };

  React.useEffect(() => {
    loadAsset();
  }, []);

  if (!isReady) {
    return <AppLoading />;
  }
  return (
    <Recoil.RecoilRoot>
      <SafeAreaProvider>
        <Root>
          <HomeNavigator />
        </Root>
      </SafeAreaProvider>
    </Recoil.RecoilRoot>
  );
}