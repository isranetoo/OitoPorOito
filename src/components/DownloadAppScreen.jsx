import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DownloadAppScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // iPad width is 768px (portrait), so show if width < 768
    function handleResize() {
      setShow(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 w-[100vw] h-[100vh] z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white px-0"
      style={{ minHeight: '100vh', minWidth: '100vw', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
        <img
          src="/assets/logo.png"
          alt="Logo OitoPorOito"
          className="h-20 w-20 mb-6 drop-shadow-lg rounded-full bg-[#232526] p-1 border border-[#c29d5d]"
        />
        <h2 className="text-2xl font-bold mb-2 text-[#e7c27d] text-center drop-shadow">Baixe o App para uma experiência melhor!</h2>
        <p className="text-gray-300 mb-8 text-center text-base">Jogue, aprenda e resolva puzzles no seu celular.</p>
        <div className="flex gap-6 mb-8">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/640px-Download_on_the_App_Store_RGB_blk.svg.png"
              alt="Baixar na App Store"
              className="h-14 w-auto rounded-lg shadow-lg  bg-[#232526] hover:scale-105 transition-all duration-200"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/640px-Google_Play_Store_badge_EN.svg.png"
              alt="Baixar na Play Store"
              className="h-14 w-auto rounded-lg shadow-lg  bg-[#232526] hover:scale-105 transition-all duration-200"
            />
          </a>
        </div>
      </div>
      {/* Footer simplificado para tela de download */}
      <footer className="w-full py-4 px-2 bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-gray-400 text-xs flex flex-col items-center border-t border-[#c29d5d]/20 mt-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-1">
          <a href="#" className="hover:text-[#c29d5d] transition-colors">Suporte</a>
          <span className="mx-1 text-gray-600">•</span>
          <a href="#" className="hover:text-[#c29d5d] transition-colors">Política de privacidade</a>
          <span className="mx-1 text-gray-600">•</span>
          <a href="#" className="hover:text-[#c29d5d] transition-colors">Contrato de Usuário</a>
        </div>
        <span className="font-semibold text-[#c29d5d]">OitoPorOito.com © 2025</span>
      </footer>
    </motion.div>
  );
}
