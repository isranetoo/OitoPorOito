export default function ForumSidebar({ recent }) {
  return (
    <>
      {/* Bloco: navegação rápida */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <h3 className="font-semibold">Fóruns</h3>
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <ul className="p-2">
          {["Meus tópicos", "Temas quentes", "Sem resposta", "Seguindo"].map((i) => (
            <li key={i}>
              <a className="block px-2 py-2 rounded hover:bg-white/5 text-sm cursor-pointer">{i}</a>
            </li>
          ))}
        </ul>
        <div className="p-3">
          <button className="w-full rounded-md bg-[#e7c27d] hover:bg-[#d6b95b] text-black font-semibold py-2">
            Novo tópico
          </button>
        </div>
        <div className="px-3 pb-3">
          <select className="w-full bg-[#1f201e] border border-white/10 rounded px-3 py-2 text-sm">
            <option>-- Categoria --</option>
            <option>Geral</option>
            <option>Iniciantes</option>
            <option>Partidas</option>
          </select>
        </div>
      </div>
      {/* Bloco: busca */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10 p-3">
        <div className="relative">
          <input
            className="w-full rounded bg-[#1f201e] border border-white/10 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Buscar tópicos do fórum..."
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      {/* Bloco: Mais Recente */}
      <div className="rounded-md bg-[#2a2b29] border border-white/10">
        <h3 className="px-4 py-3 font-semibold border-b border-white/10">Mais Recente</h3>
        <ul className="p-2 text-sm divide-y divide-white/10">
          {recent.map((r, i) => (
            <li key={i} className="py-2">
              <a className="hover:underline block cursor-pointer">{r.title}</a>
              <span className="text-xs text-gray-400">{r.author} • {r.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
