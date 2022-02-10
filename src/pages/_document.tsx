import React, { ReactElement } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head />
        <body className="relative">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
