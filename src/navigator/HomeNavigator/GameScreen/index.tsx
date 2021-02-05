import { Layout } from "@ui-kitten/components";
import React from "react";
import { HomeNavigatorScreenProps } from "expo-go/navigator/HomeNavigator";
import { GoGame, Controller, Header } from "expo-go/component/go";
import {
  useCreateNewGameAction,
  useCreateNewGameState,
} from "expo-go/recoil/NewGame";
import { useGameListAction } from "expo-go/recoil/GameList";
import { useGameState } from "expo-go/recoil/Go";
import { GameItem } from "expo-go/type/interface";
import { useBool } from "expo-go/util/useBool";
import { GameStatus, GameUtil, Territory } from "expo-go/util/GameUtil";

interface Props extends HomeNavigatorScreenProps<"Home.Main"> {}

export const GameScreen = React.memo(({ navigation }: Props) => {
  const matchName = useCreateNewGameState((state) => state.matchName);
  const { saveGame } = useGameListAction();
  const { resetCreateNewGameState } = useCreateNewGameAction();
  const game = useGameState((state) => state);
  const config = useCreateNewGameState((state) => state);

  const [territory, setTerritory] = React.useState<Territory[][] | undefined>(
    undefined
  );
  const [gameStatus, setGameStatus] = React.useState<GameStatus | undefined>(
    undefined
  );

  const { show, toggle } = useBool(false);

  const ref = React.useRef<GameItem>({
    ...config,
    game,
  });
  ref.current = {
    ...config,
    game,
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: matchName,
    });
  }, [matchName]);

  React.useEffect(() => {
    return () => {
      saveGame(ref.current);
      // resetCreateNewGameState();
    };
  }, []);

  React.useEffect(() => {
    if (show) {
      const { territory, ...gameStatus } = GameUtil.getTerritory(
        config.size,
        game.history[game.currentIndex].movement
      );
      setGameStatus(gameStatus);
      setTerritory(territory);
    } else {
      setTerritory(undefined);
      setGameStatus(undefined);
    }
  }, [show, game, config]);

  return (
    <Layout style={{ flex: 1 }}>
      <Header gameStatus={gameStatus} />
      <GoGame territory={territory} />
      <Controller toggleTerritory={toggle} />
    </Layout>
  );
});
