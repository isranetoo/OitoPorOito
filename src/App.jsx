import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Board from "./components/Board";
import CTA from "./components/CTA";

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <Navbar />
      <main className="flex justify-center items-center bg-[#2c2c2c] p-8">
        <div className="flex gap-12 items-center">
          <Board />
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
