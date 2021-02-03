import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeNavigator } from "./src/navigator/HomeNavigator";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { Ionicons } from "@expo/vector-icons";
import Recoil from "recoil";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      ...Ionicons.font,
    });
  };

  const lockPortrait = async () => {
    return ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  const loadAsset = async () => {
    await Promise.all([loadFont(), lockPortrait()]);
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
        <StatusBar barStyle="dark-content" />
        <ApplicationProvider {...eva} theme={eva.light}>
          <HomeNavigator />
        </ApplicationProvider>
      </SafeAreaProvider>
    </Recoil.RecoilRoot>
  );
}
