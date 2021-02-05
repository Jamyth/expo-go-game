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
const KOMI = [0, ...[...new Array(7)].map((_, i) => i + 1.5)];

export const CreateScreen = React.memo(({ navigation }: Props) => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  const {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
    resetCreateNewGameState,
    updateHandicap,
    updateKomi,
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
  const komiTranslator = (komi: number) => {
    if (komi === 0) {
      return `不貼目`;
    }
    const chineseNumber = ["一", "兩", "三", "四", "五", "六", "七", "八"];
    return `貼${chineseNumber[Math.floor(komi) - 1]}目半`;
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
            defaultValue={state.matchName}
            onChangeText={updateMatchName}
            onEndEditing={(e) => updateMatchName(e.nativeEvent.text)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            label="玩家一名稱 (黑棋)"
            placeholder="Player 1 Name"
            defaultValue={state.player1.name}
            onChangeText={(name) => updatePlayer1({ name })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            label="玩家二名稱 (白棋)"
            placeholder="Player 2 Name"
            defaultValue={state.player2.name}
            onChangeText={(name) => updatePlayer2({ name })}
          />
        </Form.Item>
        <Form.Item>
          <EnumSelect
            label="棋盤規格"
            list={[9, 13, 19]}
            translator={(_) => `${_}路`}
            value={state.size}
            onChange={updateSize}
          />
        </Form.Item>
        <Form.Item>
          <EnumSelect
            label="讓子"
            list={HANDICAP}
            translator={handicapTranslator}
            value={state.handicap}
            onChange={updateHandicap}
            disabled={state.size === 9}
          />
        </Form.Item>
        <Form.Item>
          <EnumSelect
            label="貼目"
            list={KOMI}
            translator={komiTranslator}
            value={state.komi}
            onChange={updateKomi}
          />
        </Form.Item>
        <Button style={{ marginTop: 20 }} onPress={navigateToGame}>
          開始對局
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
