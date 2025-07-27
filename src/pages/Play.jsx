

import React from "react";
import Navbar from "../components/Navbar";
import PlayGame from "../components/PlayGame/PlayGame";

export default function Play() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white">
      <Navbar  classname="text-white"/>
      <PlayGame />
    </div>
  );
}
