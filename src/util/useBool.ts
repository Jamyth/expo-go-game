import React from "react";

export const useBool = (initialState: boolean = false) => {
  const [show, setShow] = React.useState(initialState);

  const on = () => setShow(true);
  const off = () => setShow(false);
  const toggle = () => setShow(!show);

  return {
    show,
    on,
    off,
    toggle,
  };
};
