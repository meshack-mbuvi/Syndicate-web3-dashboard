import Document, { Head, Html, Main, NextScript } from "next/document";
import React, { ReactElement } from "react";

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head />
        <body className="relative overflow-x-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
