import React from "react";
import { Dimensions } from "react-native";
import { View, Button } from "native-base";
import { Image } from "react-native";
import FastImage from "react-native-fast-image";

interface Props {
  size: 9 | 13 | 19;
}

export const Board = React.memo(({ size }: Props) => {
  const width = Dimensions.get("screen").width;

  // const unitWidth = width / size;

  const img = React.useMemo(() => {
    switch (size) {
      case 9:
        return require("../../../assets/images/9.png");
      case 13:
        return require("../../../assets/images/13.png");
      case 19:
        return require("../../../assets/images/19.png");
    }
  }, [size]);

  return (
    <React.Fragment>
      <Image style={{ width, height: width }} source={img} />
      {/* {new Array(size).fill(0).map((_, i) => {
        return (
          <View key={`row-${i}`} style={{ flexDirection: "row" }}>
            {new Array(size).fill(0).map((_, j) => {
              const source = React.useMemo(() => {
                const isStar =
                  ((i === 3 || i === size - 4) &&
                    (j === 3 || j === size - 4)) ||
                  ((i === 3 || i === size - 4) && j === (size - 1) / 2) ||
                  ((j === 3 || j === size - 4) && i === (size - 1) / 2);
                return i === 0 && j === 0
                  ? require("../../../assets/images/top-left.png")
                  : i === 0 && j === size - 1
                  ? require("../../../assets/images/top-right.png")
                  : i === size - 1 && j === 0
                  ? require("../../../assets/images/bottom-left.png")
                  : i === size - 1 && j === size - 1
                  ? require("../../../assets/images/bottom-right.png")
                  : j === 0
                  ? require("../../../assets/images/left-side.png")
                  : j === size - 1
                  ? require("../../../assets/images/right-side.png")
                  : i === 0
                  ? require("../../../assets/images/top-side.png")
                  : i === size - 1
                  ? require("../../../assets/images/bottom-side.png")
                  : isStar && size !== 9
                  ? require("../../../assets/images/star.png")
                  : i === (size - 1) / 2 && j === (size - 1) / 2
                  ? require("../../../assets/images/star.png")
                  : require("../../../assets/images/cross.png");
              }, [size]);
              return (
                <Button
                  transparent
                  style={{ width: unitWidth, height: unitWidth }}
                  key={`col-${(j + 1) * (i + 1)}`}
                >
                  <Image
                    style={{ width: unitWidth, height: unitWidth }}
                    source={source}
                  />
                </Button>
              );
            })}
          </View>
        );
      })} */}
    </React.Fragment>
  );
});
