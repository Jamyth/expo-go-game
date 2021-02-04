import { Layout, Spinner, Text, Button } from "@ui-kitten/components";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListItem } from "./ListItem";
import { useGameListAction, useGameListState } from "expo-go/recoil/GameList";
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { GameItem } from "expo-go/type/interface";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const MainScreen = React.memo(({ navigation }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const { list } = useGameListState();
  const { setList } = useGameListAction();

  const ref = React.useRef<GameItem[]>(list);
  ref.current = list;

  const navigateToCreate = () => {
    navigation.navigate("Home.Create");
  };

  const getListFromStorage = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const list = await AsyncStorage.getItem("match_list");
    setLoading(false);
    if (list) {
      setList(JSON.parse(list));
    }
  };

  const saveToStorage = async (state: AppStateStatus) => {
    if (state === "inactive") {
      await AsyncStorage.setItem("match_list", JSON.stringify(list));
    }
  };

  React.useEffect(() => {
    getListFromStorage();
  }, []);

  React.useEffect(() => {
    AppState.addEventListener("change", saveToStorage);
    return () => {
      AppState.removeEventListener("change", saveToStorage);
    };
  }, [list]);

  return (
    <Layout style={styles.container}>
      {!list.length && (
        <View style={{ alignItems: "center", paddingVertical: 25 }}>
          <Text>找不到對局列表</Text>
        </View>
      )}
      <FlatList
        refreshing={loading}
        onRefresh={getListFromStorage}
        data={list}
        renderItem={(_) => <ListItem item={_.item} />}
      />
      <Button
        style={styles.overflowButton}
        onPress={navigateToCreate}
        accessoryLeft={() => (
          <MaterialIcons name="create" size={24} color="white" />
        )}
      />
    </Layout>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    position: "relative",
  },
  overflowButton: {
    position: "absolute",
    zIndex: 2,
    bottom: 20,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 50,
  },
});
