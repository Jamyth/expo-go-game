import {
  Container,
  Content,
  Form,
  Input,
  Item,
  Picker,
  Button,
  Text,
} from "native-base";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import Recoil from "recoil";
import {
  CreateNewGameState,
  useCreateNewGameAction,
} from "expo-go/recoil/NewGame";
import { useCreateGame } from "expo-go/recoil/Go";
import { StatusBar } from "react-native";

interface Props extends HomeNavigatorScreenProps<"Home.Create"> {}

export const CreateScreen = React.memo(({ navigation }: Props) => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  const {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
  } = useCreateNewGameAction();
  const newGame = useCreateGame();

  const navigateToGame = () => {
    newGame();
    navigation.navigate("Home.Game");
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Content style={{ padding: 10 }}>
        <Form>
          <Item>
            <Input
              placeholder="Match Name"
              value={state.matchName}
              onChangeText={updateMatchName}
            />
          </Item>
          <Item>
            <Input
              placeholder="Player 1 Name"
              value={state.player1.name}
              onChangeText={(name) => updatePlayer1({ name })}
            />
          </Item>
          <Item>
            <Input
              placeholder="Player 2 Name"
              value={state.player2.name}
              onChangeText={(name) => updatePlayer2({ name })}
            />
          </Item>
          <Item last>
            <Picker
              note
              mode="dropdown"
              style={{ width: "100%" }}
              selectedValue={state.size}
              onValueChange={updateSize}
            >
              <Picker.Item label="9" value={9} />
              <Picker.Item label="13" value={13} />
              <Picker.Item label="19" value={19} />
            </Picker>
          </Item>
          <Button full style={{ marginTop: 20 }} onPress={navigateToGame}>
            <Text>New Game</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
});
