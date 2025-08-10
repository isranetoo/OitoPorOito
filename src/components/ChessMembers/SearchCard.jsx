export default function SearchCard(){
	return (
		<div className="rounded-xl bg-[#232526]/80 border border-[#c29d5d]/20 p-4">
			<h3 className="font-semibold text-[#e7c27d]">Pesquisar Membros</h3>

			<div className="mt-3 relative">
				<input className="w-full rounded bg-[#181818] border border-[#c29d5d]/20 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:ring-emerald-500/40 focus:outline-none" placeholder="Pesquisar Membros" aria-label="Pesquisar Membros" />
				<span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
			</div>

			<select className="mt-3 w-full rounded bg-[#181818] border border-[#c29d5d]/20 px-3 py-2 text-sm">
				<option>Todos os Países</option>
				<option>Brasil</option>
				<option>Portugal</option>
			</select>

			<div className="mt-3 flex items-center gap-3">
				<button className="flex-1 rounded bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black font-semibold py-2 shadow hover:from-[#ffe7b3] hover:to-[#e7c27d]">Pesquisar</button>
				<button className="text-sm text-[#e7c27d]">Avançado ▾</button>
			</div>
		</div>
	);
}
