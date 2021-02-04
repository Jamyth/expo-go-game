import React from "react";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { ControlledFormValue } from "expo-go/type/interface";

export interface BaseProps<Enum extends string | number | boolean> {
  list: readonly Enum[];
  translator: (enumValue: Enum) => string;
  label?: string;
  disabled?: boolean;
}

interface Props<Enum extends string | number | boolean>
  extends BaseProps<Enum>,
    ControlledFormValue<Enum> {}

interface State {
  selected: IndexPath;
}

export class EnumSelect<
  Enum extends string | boolean | number
> extends React.PureComponent<Props<Enum>, State> {
  constructor(props: Props<Enum>) {
    super(props);
    const { list, value } = props;
    this.state = {
      selected: new IndexPath(list.indexOf(value)),
    };
  }

  onSelect = (index: IndexPath | IndexPath[]) => {
    const { onChange, list } = this.props;
    if (Array.isArray(index)) {
      return;
    }
    this.setState({ selected: index });
    onChange(list[index.row]);
  };

  render() {
    const { label, translator, disabled, list, value } = this.props;
    const { selected } = this.state;
    return (
      <Select
        label={label}
        selectedIndex={selected}
        onSelect={this.onSelect}
        value={translator(value)}
        disabled={disabled}
      >
        {list.map((item, index) => (
          <SelectItem key={index} title={translator(item)} />
        ))}
      </Select>
    );
  }
}
