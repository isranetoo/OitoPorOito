export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Buscar por nome ou nome de usuário"
        className="w-full px-4 py-2 rounded-xl bg-[#232526] border-2 border-[#c29d5d]/40 text-white placeholder-gray-400 shadow-lg focus:outline-none focus:border-[#c29d5d] transition-all duration-200"
      />
    </div>
  );
}
