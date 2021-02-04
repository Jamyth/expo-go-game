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
import { Form } from "expo-go/component/Form";
import { StyleSheet } from "react-native";

interface Props extends HomeNavigatorScreenProps<"Home.Create"> {}

const HANDICAP = [...new Array(10)].map((_, i) => i);

export const CreateScreen = React.memo(({ navigation }: Props) => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  const {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
    resetCreateNewGameState,
    updateHandicap,
  } = useCreateNewGameAction();
  const newGame = useCreateGame();

  const navigateToGame = () => {
    newGame();
    navigation.replace("Home.Game");
  };

  const handicapTranslator = (handicap: number) => {
    if (handicap === 0) {
      return `不讓子`;
    }
    return `讓${handicap}子`;
  };

  React.useEffect(() => {
    resetCreateNewGameState();
  }, []);

  return (
    <Layout style={styles.container}>
      <Form>
        <Form.Item>
          <Input
            label="對局名稱"
            value={state.matchName}
            onChangeText={updateMatchName}
          />
        </Form.Item>
        <Form.Item>
          <Input
            label="玩家一名稱"
            placeholder="Player 1 Name"
            value={state.player1.name}
            onChangeText={(name) => updatePlayer1({ name })}
            // onEndEditing={(e) => updatePlayer1({ name: e.nativeEvent.text })}
            onChange={(e) => updatePlayer1({ name: e.nativeEvent.text })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            label="玩家二名稱"
            placeholder="Player 2 Name"
            value={state.player2.name}
            onChangeText={(name) => updatePlayer2({ name })}
          />
        </Form.Item>
        <Form.Item>
          <EnumSelect
            label="棋盤規格"
            list={[9, 13, 19]}
            translator={(_) => `${_}路`}
            value={state.size}
            onChange={(value) => updateSize(value)}
          />
        </Form.Item>
        <Form.Item>
          <EnumSelect
            label="讓子"
            list={HANDICAP}
            translator={handicapTranslator}
            value={state.handicap}
            onChange={(value) => updateHandicap(value)}
          />
        </Form.Item>
        <Button style={{ marginTop: 20 }} onPress={navigateToGame}>
          New Game
        </Button>
      </Form>
    </Layout>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
