import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

const wrapRootElement = ({ element }) => (
  <Provider store={store()}>{element}</Provider>
);

export default wrapRootElement;
