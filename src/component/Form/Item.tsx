import { SafeReactChildren } from "expo-go/type/interface";
import React from "react";
import { View, StyleSheet } from "react-native";

interface Props {
  children: SafeReactChildren;
}

export const Item = React.memo(({ children }: Props) => {
  return <View style={{ marginBottom: 10 }}>{children}</View>;
});
