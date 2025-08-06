export default function ActionButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black p-3 rounded-xl shadow-lg border-2 border-[#c29d5d]/40 font-bold w-full md:w-auto hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:text-[#232526] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
    >
      <span className="text-2xl drop-shadow">{icon}</span>
      <span className="font-semibold text-lg">{text}</span>
    </button>
  );
}
