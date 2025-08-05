export default function NextLessonButton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold py-3 rounded-xl shadow-lg border-2 border-[#c29d5d]/60 hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
      >
        Começar Aula
      </button>
      <button
        className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-bold py-3 rounded-xl shadow-lg border-2 border-[#c29d5d]/60 hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
      >
        Próxima Aula
      </button>
    </div>
  );
}
