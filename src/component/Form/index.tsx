import { SafeReactChildren } from "expo-go/type/interface";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Item } from "./Item";

interface Props {
  children: SafeReactChildren;
}

export class Form extends React.PureComponent<Props> {
  static Item = Item;

  render() {
    const { children } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
