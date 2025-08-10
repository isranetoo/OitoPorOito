const recents = [
	{ id:1, user:'skewer-BOT', country:'🇺🇸', avatar:'/assets/bot.png', blitz:true },
	{ id:2, user:'ChessFan', country:'🇧🇷', avatar:'/assets/u13.jpg', blitz:false },
	{ id:3, user:'KnightAttack', country:'🇫🇷', avatar:'/assets/u14.jpg', blitz:true },
];

export default function RecentOpponents(){
	return (
		<div className="rounded-2xl bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] border-t-2 border-b-2 border-[#c29d5d]/30 overflow-hidden shadow-xl">
			<div className="px-4 py-3 flex items-center justify-between bg-black/20">
				<h2 className="font-semibold text-[#e7c27d] text-lg">Adversários recentes</h2>
				<span className="text-[#e7c27d]/80">▸</span>
			</div>
			<ul className="divide-y divide-white/10">
				{recents.map(r => (
					<li key={r.id} className="flex items-center gap-3 px-4 py-3">
						<img src={r.avatar} alt={r.user} className="h-10 w-10 rounded" />
						<a className="font-medium hover:underline" tabIndex={0}>{r.user}</a>
						<span className="ml-2 text-sm">{r.country}</span>
						{r.blitz && <span className="ml-auto text-xs text-[#e7c27d]">♟️ blitz</span>}
					</li>
				))}
			</ul>
		</div>
	);
}
