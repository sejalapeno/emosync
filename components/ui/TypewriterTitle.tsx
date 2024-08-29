"use client";
import React from "react";

import Typewriter from "typewriter-effect";
type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{ loop: true }}
      onInit={(typewriter) => {
        typewriter
          .typeString(" ⚡️Get curated playlists!")
          .pauseFor(2000)
          .deleteAll()
          .typeString("⚡️Get mood tailored playlists")
          .pauseFor(2000)
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
