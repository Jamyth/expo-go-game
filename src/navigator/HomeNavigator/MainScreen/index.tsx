import {
  Container,
  Fab,
  Spinner,
  View,
  Text,
  List,
  Content,
  ListItem as Li,
} from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListItem } from "./ListItem";
import { useGameListAction, useGameListState } from "expo-go/recoil/GameList";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const MainScreen = React.memo(({ navigation }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const update = React.useReducer((s) => s + 1, [])[1];
  const { list } = useGameListState();
  const { setList } = useGameListAction();
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

  const saveToStorage = async () => {
    console.log(list.length);
    await AsyncStorage.setItem("match_list", JSON.stringify(list));
  };

  React.useEffect(() => {
    getListFromStorage();
    navigation.addListener("focus", () => update());
  }, []);

  return (
    <Container>
      {loading && (
        <View style={{ justifyContent: "center" }}>
          <Spinner />
        </View>
      )}
      {!list.length && (
        <View style={{ alignItems: "center", paddingVertical: 25 }}>
          <Text>找不到對局列表</Text>
        </View>
      )}
      <Content>
        <List>
          {list.map((_) => (
            <Li key={_.id}>
              <ListItem id={_.id} />
            </Li>
          ))}
        </List>
      </Content>
      <Fab active position="bottomRight" onPress={navigateToCreate}>
        <MaterialIcons name="create" size={24} />
      </Fab>
    </Container>
  );
});
