import { Layout, Input, Button } from "@ui-kitten/components";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import Recoil from "recoil";
import {
  CreateNewGameState,
  useCreateNewGameAction,
} from "expo-go/recoil/NewGame";
import { useCreateGame } from "expo-go/recoil/Go";
import { EnumSelect } from "expo-go/component/EnumSelect";
import { Container } from "expo-go/component/Container";
import { StyleSheet } from "react-native";

interface Props extends HomeNavigatorScreenProps<"Home.Create"> {}

export const CreateScreen = React.memo(({ navigation }: Props) => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  const {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
    resetCreateNewGameState,
  } = useCreateNewGameAction();
  const newGame = useCreateGame();

  const navigateToGame = () => {
    newGame();
    navigation.replace("Home.Game");
  };

  React.useEffect(() => {
    resetCreateNewGameState();
  }, []);

  return (
    <Layout style={styles.container}>
      <Container>
        <Input
          label="對局名稱"
          value={state.matchName}
          onChangeText={updateMatchName}
        />
      </Container>
      <Container>
        <Input
          label="玩家一名稱"
          placeholder="Player 1 Name"
          value={state.player1.name}
          onChangeText={(name) => updatePlayer1({ name })}
        />
      </Container>
      <Container>
        <Input
          label="玩家二名稱"
          placeholder="Player 2 Name"
          value={state.player2.name}
          onChangeText={(name) => updatePlayer2({ name })}
        />
      </Container>
      <Container>
        <EnumSelect
          label="棋盤規格"
          list={[9, 13, 19]}
          translator={(_) => `${_}路`}
          value={state.size}
          onChange={(value) => updateSize(value as 9 | 13 | 19)}
        />
      </Container>
      <Button style={{ marginTop: 20 }} onPress={navigateToGame}>
        New Game
      </Button>
    </Layout>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
});
