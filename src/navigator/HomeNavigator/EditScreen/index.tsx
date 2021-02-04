import { Layout, Input, Button } from "@ui-kitten/components";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import Recoil from "recoil";
import {
  CreateNewGameState,
  useCreateNewGameAction,
  useCreateNewGameState,
} from "expo-go/recoil/NewGame";
import { EnumSelect } from "expo-go/component/EnumSelect";
import { Form } from "expo-go/component/Form";
import { StyleSheet } from "react-native";
import { useGameState } from "expo-go/recoil/Go";
import { useGameListAction } from "expo-go/recoil/GameList";

interface Props extends HomeNavigatorScreenProps<"Home.Create"> {}

const HANDICAP = [...new Array(10)].map((_, i) => i);
const KOMI = [0, ...[...new Array(7)].map((_, i) => i + 1.5)];

export const EditScreen = React.memo(({ navigation }: Props) => {
  const state = Recoil.useRecoilValue(CreateNewGameState);
  const {
    updateSize,
    updatePlayer1,
    updatePlayer2,
    updateMatchName,
    updateHandicap,
    updateKomi,
  } = useCreateNewGameAction();
  const { saveGame } = useGameListAction();
  const game = useGameState((state) => state);
  const config = useCreateNewGameState((state) => state);

  const onSave = () => {
    saveGame({
      ...config,
      game,
    });
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
            label="玩家一名稱 (黑棋)"
            placeholder="Player 1 Name"
            value={state.player1.name}
            onChangeText={(name) => updatePlayer1({ name })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            label="玩家二名稱 (白棋)"
            placeholder="Player 2 Name"
            value={state.player2.name}
            onChangeText={(name) => updatePlayer2({ name })}
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
        <Button style={{ marginTop: 20 }} onPress={onSave}>
          儲存
        </Button>
        <Button
          appearance="outline"
          status="basic"
          style={{ marginTop: 20 }}
          onPress={() => navigation.goBack()}
        >
          返回
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
