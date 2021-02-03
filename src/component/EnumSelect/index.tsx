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

export const EnumSelect = React.memo(
  <Enum extends string | number | boolean>({
    list,
    translator,
    disabled,
    value,
    onChange,
    label,
  }: Props<Enum>) => {
    const [selected, setSelected] = React.useState(
      new IndexPath(list.indexOf(value))
    );

    const onSelect = (index: IndexPath | IndexPath[]) => {
      if (Array.isArray(index)) {
        return;
      }
      setSelected(index);
      onChange(list[index.row]);
    };

    return (
      <Select
        label={label}
        selectedIndex={selected}
        onSelect={onSelect}
        value={translator(list[selected.row])}
        disabled={disabled}
      >
        {list.map((item, index) => (
          <SelectItem key={index} title={translator(item)} />
        ))}
      </Select>
    );
  }
);
