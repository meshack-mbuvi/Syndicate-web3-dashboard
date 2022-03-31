import React from 'react';

const FontsPreloader: React.FC = () => {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/Whyte/ABCWhyte-Medium.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
      <link
        rel="preload"
        href="/fonts/Whyte/ABCWhyte-Regular.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
      <link
        rel="preload"
        href="/fonts/Whyte Inktrap/ABCWhyteInktrap-Medium.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
      <link
        rel="preload"
        href="/fonts/Whyte Inktrap/ABCWhyteInktrap-Regular.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
      <link
        rel="preload"
        href="/fonts/ABC_Whyte_Inktrap/ABCWhyteInktrap-Extralight-Trial.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
      <link
        rel="preload"
        href="/fonts/ABC_Whyte_Inktrap/ABCWhyteInktrap-Light-Trial.woff"
        as="font"
        crossOrigin=""
        type="font/woff"
      />
    </>
  );
};

export default FontsPreloader;
