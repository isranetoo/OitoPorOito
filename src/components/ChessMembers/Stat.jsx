export default function Stat({label, value}) {
	return (
		<div className="rounded-xl bg-[#232526]/80 border border-[#c29d5d]/20 p-4 shadow flex flex-col">
			<div className="flex items-center gap-2 text-gray-300">
				<span className="h-8 w-8 rounded bg-black/30 grid place-items-center text-lg">👥</span>
				<span className="text-sm">{label}</span>
			</div>
			<div className="mt-2 text-2xl font-bold tabular-nums text-[#e7c27d]">{value}</div>
		</div>
	);
}
