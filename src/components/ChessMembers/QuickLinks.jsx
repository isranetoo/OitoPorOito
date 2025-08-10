export default function QuickLinks(){
	const items = ['Jogadores titulados','Melhores Jogadores de Xadrez','Treinadores','Streamers','Amigos','Solicitações de amizade'];
	return (
		<div className="rounded-xl bg-[#232526]/80 border border-[#c29d5d]/20">
			<div className="px-4 py-3 flex items-center justify-between border-b border-[#c29d5d]/20">
				<h3 className="font-semibold text-[#e7c27d]">Membros</h3>
				<span className="text-[#e7c27d]/80">▸</span>
			</div>
			<ul className="p-2">
				{items.map(s=>(
					<li key={s}><a className="block px-2 py-2 rounded text-sm hover:bg-white/5" tabIndex={0}>{s}</a></li>
				))}
			</ul>
		</div>
	);
}
